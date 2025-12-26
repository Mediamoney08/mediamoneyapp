import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, DollarSign, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
}

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // Update in database if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            language: languageCode
          });
      }

      // Update HTML dir attribute for RTL languages
      document.documentElement.dir = ['ar', 'he'].includes(languageCode) ? 'rtl' : 'ltr';
      
      toast({
        title: 'Language Changed',
        description: `Language changed to ${LANGUAGES.find(l => l.code === languageCode)?.name}`,
      });
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: 'Error',
        description: 'Failed to change language',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    // Set initial direction
    document.documentElement.dir = ['ar', 'he'].includes(currentLanguage) ? 'rtl' : 'ltr';
  }, [currentLanguage]);

  const currentLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center justify-between"
          >
            <span>{language.nativeName}</span>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CurrencySwitcher() {
  const { toast } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrencies();
    loadUserPreference();
  }, []);

  const loadCurrencies = async () => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('is_active', true)
        .order('code');

      if (error) throw error;
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error loading currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPreference = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('currency')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && data) {
          setCurrentCurrency(data.currency);
        }
      } else {
        // Load from localStorage for non-logged-in users
        const savedCurrency = localStorage.getItem('preferred_currency');
        if (savedCurrency) {
          setCurrentCurrency(savedCurrency);
        }
      }
    } catch (error) {
      console.error('Error loading user preference:', error);
    }
  };

  const changeCurrency = async (currencyCode: string) => {
    try {
      setCurrentCurrency(currencyCode);
      
      // Save to localStorage
      localStorage.setItem('preferred_currency', currencyCode);

      // Update in database if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            currency: currencyCode
          });
      }

      const currency = currencies.find(c => c.code === currencyCode);
      toast({
        title: 'Currency Changed',
        description: `Currency changed to ${currency?.name} (${currency?.symbol})`,
      });

      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currencyCode }));
    } catch (error) {
      console.error('Error changing currency:', error);
      toast({
        title: 'Error',
        description: 'Failed to change currency',
        variant: 'destructive',
      });
    }
  };

  const currentCurrencyData = currencies.find(c => c.code === currentCurrency);

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <DollarSign className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <DollarSign className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
        <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => changeCurrency(currency.code)}
            className="flex items-center justify-between"
          >
            <span>
              {currency.symbol} {currency.code}
            </span>
            {currentCurrency === currency.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook to use currency conversion
export function useCurrency() {
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    loadCurrency();

    const handleCurrencyChange = (event: CustomEvent) => {
      loadCurrency();
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, []);

  const loadCurrency = async () => {
    const savedCurrency = localStorage.getItem('preferred_currency') || 'USD';
    setCurrentCurrency(savedCurrency);

    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('exchange_rate, symbol')
        .eq('code', savedCurrency)
        .maybeSingle();

      if (!error && data) {
        setExchangeRate(data.exchange_rate);
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    }
  };

  const convertPrice = (priceInUSD: number): number => {
    return Number((priceInUSD * exchangeRate).toFixed(2));
  };

  const formatPrice = async (priceInUSD: number): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('symbol')
        .eq('code', currentCurrency)
        .maybeSingle();

      if (error || !data) {
        return `$${priceInUSD.toFixed(2)}`;
      }

      const convertedPrice = convertPrice(priceInUSD);
      return `${data.symbol}${convertedPrice.toFixed(2)}`;
    } catch (error) {
      return `$${priceInUSD.toFixed(2)}`;
    }
  };

  return {
    currentCurrency,
    exchangeRate,
    convertPrice,
    formatPrice,
  };
}