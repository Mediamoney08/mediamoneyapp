import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Printer } from 'lucide-react';
import type { Order } from '@/types/types';
import { format } from 'date-fns';

interface InvoiceDialogProps {
  order: Order;
}

export default function InvoiceDialog({ order }: InvoiceDialogProps) {
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(getInvoiceHTML());
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.id.slice(0, 8)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 32px;
            font-weight: bold;
            color: #4F46E5;
            margin-bottom: 5px;
          }
          .invoice-title {
            font-size: 24px;
            color: #666;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .info-block {
            flex: 1;
          }
          .info-block h3 {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          .info-block p {
            margin: 5px 0;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin: 10px 0;
            font-size: 16px;
          }
          .total-label {
            margin-right: 20px;
            min-width: 150px;
            text-align: right;
          }
          .total-value {
            min-width: 100px;
            font-weight: bold;
          }
          .grand-total {
            font-size: 20px;
            color: #4F46E5;
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-completed {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Recharge Hub</div>
          <div class="invoice-title">INVOICE</div>
        </div>

        <div class="info-section">
          <div class="info-block">
            <h3>Invoice Details</h3>
            <p><strong>Invoice #:</strong> ${order.id.slice(0, 8).toUpperCase()}</p>
            <p><strong>Date:</strong> ${format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></p>
          </div>
          <div class="info-block">
            <h3>Customer Information</h3>
            <p><strong>Customer ID:</strong> ${order.user_id.slice(0, 8)}</p>
            <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Product ID</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item, index) => `
              <tr key="${index}">
                <td>
                  <strong>${item.name}</strong><br>
                  <span style="color: #666; font-size: 14px;">Product ID: ${item.product_id.slice(0, 8)}</span>
                </td>
                <td>${item.product_id.slice(0, 8).toUpperCase()}</td>
                <td style="text-align: right;">$${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div class="total-value">$${order.total_amount.toFixed(2)}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Tax (0%):</div>
            <div class="total-value">$0.00</div>
          </div>
          <div class="total-row grand-total">
            <div class="total-label">Total Amount:</div>
            <div class="total-value">$${order.total_amount.toFixed(2)}</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Recharge Hub</strong></p>
          <p>Digital Recharge Services Platform</p>
          <p>Thank you for your business!</p>
          <p style="margin-top: 20px;">This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice #{order.id.slice(0, 8).toUpperCase()}</DialogTitle>
          <DialogDescription>
            Order placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="text-center border-b-2 border-primary pb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">Recharge Hub</h1>
            <p className="text-xl text-muted-foreground">INVOICE</p>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">INVOICE DETAILS</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Invoice #:</span> {order.id.slice(0, 8).toUpperCase()}</p>
                <p><span className="font-medium">Date:</span> {format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">CUSTOMER INFORMATION</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Customer ID:</span> {order.user_id.slice(0, 8)}</p>
                <p><span className="font-medium">Order ID:</span> {order.id.slice(0, 8)}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold">Description</th>
                  <th className="text-left p-3 font-semibold">Product ID</th>
                  <th className="text-right p-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Product ID: {item.product_id.slice(0, 8)}</p>
                      </div>
                    </td>
                    <td className="p-3">{item.product_id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-3 text-right font-medium">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%):</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 pt-2">
                <span>Total Amount:</span>
                <span className="text-primary">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground border-t pt-6">
            <p className="font-semibold">Recharge Hub</p>
            <p>Digital Recharge Services Platform</p>
            <p className="mt-2">Thank you for your business!</p>
            <p className="mt-4 text-xs">This is a computer-generated invoice and does not require a signature.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t no-print">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
