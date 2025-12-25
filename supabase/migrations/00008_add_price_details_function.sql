-- Create function to get detailed price calculation
CREATE OR REPLACE FUNCTION get_price_details(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_base_price DECIMAL(10,2);
  v_profit_margin DECIMAL(5,2);
  v_use_global_margin BOOLEAN;
  v_global_margin DECIMAL(5,2);
  v_price_with_margin DECIMAL(10,2);
  v_custom_rate DECIMAL(10,2);
  v_user_level_discount DECIMAL(5,2);
  v_final_price DECIMAL(10,2);
  v_savings DECIMAL(10,2);
  v_discount_percentage DECIMAL(5,2);
  v_discount_reason TEXT;
BEGIN
  -- Get product pricing info
  SELECT 
    COALESCE(base_price, price) as base,
    profit_margin,
    use_global_margin
  INTO v_base_price, v_profit_margin, v_use_global_margin
  FROM products
  WHERE id = p_product_id;

  -- Get global margin if needed
  IF v_use_global_margin THEN
    SELECT value::DECIMAL INTO v_global_margin
    FROM global_settings
    WHERE key = 'global_profit_margin';
    v_profit_margin := COALESCE(v_global_margin, 10);
  END IF;

  -- Calculate price with margin
  v_price_with_margin := v_base_price * (1 + v_profit_margin / 100);

  -- Check for custom rate
  SELECT custom_price INTO v_custom_rate
  FROM custom_rates
  WHERE user_id = p_user_id 
    AND product_id = p_product_id
    AND is_active = true;

  IF v_custom_rate IS NOT NULL THEN
    v_final_price := v_custom_rate;
    v_savings := v_price_with_margin - v_final_price;
    v_discount_percentage := (v_savings / v_price_with_margin) * 100;
    v_discount_reason := 'Custom Rate';
  ELSE
    -- Get user level discount
    SELECT COALESCE(ul.discount_percentage, 0)
    INTO v_user_level_discount
    FROM profiles p
    LEFT JOIN user_levels ul ON p.user_level_id = ul.id
    WHERE p.id = p_user_id;

    -- Apply user level discount
    v_final_price := v_price_with_margin * (1 - v_user_level_discount / 100);
    v_savings := v_price_with_margin - v_final_price;
    v_discount_percentage := v_user_level_discount;
    
    IF v_user_level_discount > 0 THEN
      SELECT ul.name INTO v_discount_reason
      FROM profiles p
      LEFT JOIN user_levels ul ON p.user_level_id = ul.id
      WHERE p.id = p_user_id;
      v_discount_reason := v_discount_reason || ' Level Discount';
    ELSE
      v_discount_reason := NULL;
    END IF;
  END IF;

  -- Return JSON object
  RETURN json_build_object(
    'base_price', v_base_price,
    'profit_margin', v_profit_margin,
    'price_with_margin', v_price_with_margin,
    'user_level_discount', COALESCE(v_user_level_discount, 0),
    'custom_rate', v_custom_rate,
    'final_price', v_final_price,
    'savings', COALESCE(v_savings, 0),
    'discount_percentage', COALESCE(v_discount_percentage, 0),
    'discount_reason', v_discount_reason
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;