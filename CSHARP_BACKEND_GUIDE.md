# C# Backend - Stripe Payment Integration Guide

## 📋 Ümumi Məlumat

Bu faylda MatchArena-Front layihəsi üçün C# (ASP.NET Core) backend-də Stripe ödəniş sisteminin necə qurulacağı izah edilir.

## 🔧 Quraşdırma

### 1. NuGet Paketlərinin Yüklənməsi

```bash
dotnet add package Stripe.net
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

### 2. appsettings.json Konfiqurasiyası

```json
{
  "Stripe": {
    "SecretKey": "sk_test_your_secret_key_here",
    "PublishableKey": "pk_test_your_publishable_key_here",
    "WebhookSecret": "whsec_your_webhook_secret_here"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MatchArenaDB;Trusted_Connection=True;"
  }
}
```

## 📊 Database Models

### Payment Entity

```csharp
using System;
using System.ComponentModel.DataAnnotations;

namespace MatchArena.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string PaymentIntentId { get; set; }
        
        [Required]
        public string StripePaymentId { get; set; }
        
        [Required]
        public string Type { get; set; } // "product" or "field"
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        public string Currency { get; set; } = "azn";
        
        [Required]
        public string Status { get; set; } // "pending", "completed", "failed"
        
        // Customer Info
        [Required]
        public string CustomerName { get; set; }
        
        [Required]
        public string CustomerEmail { get; set; }
        
        [Required]
        public string CustomerPhone { get; set; }
        
        // Type-specific data (JSON)
        public string Metadata { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
    }
}
```

### Field Reservation Entity

```csharp
using System;
using System.ComponentModel.DataAnnotations;

namespace MatchArena.Models
{
    public class FieldReservation
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int FieldId { get; set; }
        
        [Required]
        public int PaymentId { get; set; }
        
        [Required]
        public DateTime ReservationDate { get; set; }
        
        [Required]
        public string TimeSlot { get; set; }
        
        [Required]
        public int Duration { get; set; }
        
        public int PlayerCount { get; set; }
        
        [Required]
        public string Status { get; set; } = "active"; // "active", "cancelled", "completed"
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Payment Payment { get; set; }
    }
}
```

### Product Order Entity

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MatchArena.Models
{
    public class ProductOrder
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PaymentId { get; set; }
        
        [Required]
        public string OrderNumber { get; set; }
        
        [Required]
        public decimal TotalAmount { get; set; }
        
        [Required]
        public string Status { get; set; } = "pending"; // "pending", "processing", "shipped", "delivered"
        
        // Delivery Info
        [Required]
        public string DeliveryAddress { get; set; }
        
        [Required]
        public string City { get; set; }
        
        public string ZipCode { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ShippedAt { get; set; }
        public DateTime? DeliveredAt { get; set; }
        
        // Navigation properties
        public Payment Payment { get; set; }
        public List<OrderItem> Items { get; set; }
    }
    
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public string ProductName { get; set; }
        
        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        public string Size { get; set; }
        
        // Navigation properties
        public ProductOrder Order { get; set; }
    }
}
```

## 🎯 API Controllers

### PaymentController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Threading.Tasks;
using MatchArena.Models;
using MatchArena.Data;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MatchArena.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _stripeSecretKey;

        public PaymentsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _stripeSecretKey = configuration["Stripe:SecretKey"];
            StripeConfiguration.ApiKey = _stripeSecretKey;
        }

        // POST: api/payments/create-intent
        [HttpPost("create-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
        {
            try
            {
                // Validate request
                if (request.Amount <= 0)
                {
                    return BadRequest(new { error = "Invalid amount" });
                }

                // Create Stripe Payment Intent
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(request.Amount * 100), // Convert to qəpik
                    Currency = request.Currency ?? "azn",
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                    },
                    Metadata = new Dictionary<string, string>
                    {
                        { "type", request.Type },
                        { "customerName", request.Metadata?.CustomerName ?? "" },
                        { "customerEmail", request.Metadata?.CustomerEmail ?? "" },
                        { "customerPhone", request.Metadata?.CustomerPhone ?? "" }
                    }
                };

                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                // Save to database
                var payment = new Payment
                {
                    PaymentIntentId = paymentIntent.Id,
                    StripePaymentId = "",
                    Type = request.Type,
                    Amount = request.Amount,
                    Currency = request.Currency ?? "azn",
                    Status = "pending",
                    CustomerName = request.Metadata?.CustomerName ?? "",
                    CustomerEmail = request.Metadata?.CustomerEmail ?? "",
                    CustomerPhone = request.Metadata?.CustomerPhone ?? "",
                    Metadata = JsonConvert.SerializeObject(request.Metadata)
                };

                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    clientSecret = paymentIntent.ClientSecret,
                    paymentIntentId = paymentIntent.Id
                });
            }
            catch (StripeException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", message = ex.Message });
            }
        }

        // POST: api/payments/confirm
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                // Retrieve payment intent from Stripe
                var service = new PaymentIntentService();
                var paymentIntent = await service.GetAsync(request.PaymentIntentId);

                if (paymentIntent.Status != "succeeded")
                {
                    return BadRequest(new { error = "Payment not successful" });
                }

                // Find payment in database
                var payment = await _context.Payments
                    .FirstOrDefaultAsync(p => p.PaymentIntentId == request.PaymentIntentId);

                if (payment == null)
                {
                    return NotFound(new { error = "Payment not found" });
                }

                // Update payment
                payment.StripePaymentId = request.StripePaymentId;
                payment.Status = "completed";
                payment.CompletedAt = DateTime.UtcNow;
                payment.CustomerName = request.CustomerName;
                payment.CustomerEmail = request.CustomerEmail;
                payment.CustomerPhone = request.CustomerPhone;

                // Handle type-specific logic
                if (request.Type == "field")
                {
                    await HandleFieldReservation(payment, request);
                }
                else if (request.Type == "product")
                {
                    await HandleProductOrder(payment, request);
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    paymentId = payment.Id,
                    message = "Ödəniş uğurla tamamlandı"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal server error", message = ex.Message });
            }
        }

        private async Task HandleFieldReservation(Payment payment, ConfirmPaymentRequest request)
        {
            var reservation = new FieldReservation
            {
                FieldId = request.FieldId ?? 0,
                PaymentId = payment.Id,
                ReservationDate = DateTime.Parse(request.Date),
                TimeSlot = request.TimeSlot,
                Duration = request.Duration ?? 1,
                PlayerCount = request.PlayerCount ?? 0,
                Status = "active"
            };

            _context.FieldReservations.Add(reservation);
        }

        private async Task HandleProductOrder(Payment payment, ConfirmPaymentRequest request)
        {
            var order = new ProductOrder
            {
                PaymentId = payment.Id,
                OrderNumber = GenerateOrderNumber(),
                TotalAmount = payment.Amount,
                Status = "pending",
                DeliveryAddress = request.DeliveryAddress?.Address ?? "",
                City = request.DeliveryAddress?.City ?? "",
                ZipCode = request.DeliveryAddress?.ZipCode ?? ""
            };

            _context.ProductOrders.Add(order);
            await _context.SaveChangesAsync();

            // Add order items
            if (request.Items != null)
            {
                foreach (var item in request.Items)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = item.Id,
                        ProductName = item.Name,
                        Price = item.Price,
                        Quantity = item.Quantity,
                        Size = item.Size
                    };

                    _context.OrderItems.Add(orderItem);
                }
            }
        }

        private string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{new Random().Next(1000, 9999)}";
        }
    }

    // Request Models
    public class CreatePaymentIntentRequest
    {
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public PaymentMetadata Metadata { get; set; }
    }

    public class PaymentMetadata
    {
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public int? FieldId { get; set; }
        public string ProductIds { get; set; }
    }

    public class ConfirmPaymentRequest
    {
        public string PaymentIntentId { get; set; }
        public string StripePaymentId { get; set; }
        public string Type { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        
        // Field reservation specific
        public int? FieldId { get; set; }
        public string Date { get; set; }
        public string TimeSlot { get; set; }
        public int? Duration { get; set; }
        public int? PlayerCount { get; set; }
        
        // Product order specific
        public List<OrderItemRequest> Items { get; set; }
        public DeliveryAddressRequest DeliveryAddress { get; set; }
    }

    public class OrderItemRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; }
    }

    public class DeliveryAddressRequest
    {
        public string Address { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
    }
}
```

## 🔐 Program.cs / Startup.cs Configuration

```csharp
// Program.cs (ASP.NET Core 6+)
using Microsoft.EntityFrameworkCore;
using MatchArena.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5500", "http://127.0.0.1:5500")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## 📝 Frontend Configuration Update

Frontend-də checkout.js faylında API URL-ni yeniləyin:

```javascript
const API_BASE_URL = 'https://localhost:7001/api'; // C# backend URL
```

## 🧪 Test Kartları

Stripe test environment-də istifadə üçün:

- **Successful Payment:** `4242 4242 4242 4242`
- **Declined Payment:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

**Expiry:** İstənilən gələcək tarix (məs: 12/34)
**CVC:** İstənilən 3 rəqəm (məs: 123)
**ZIP:** İstənilən 5 rəqəm (məs: 12345)

## 📚 Əlavə Resurslar

- [Stripe .NET Documentation](https://stripe.com/docs/api?lang=dotnet)
- [ASP.NET Core Web API](https://docs.microsoft.com/en-us/aspnet/core/web-api/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
