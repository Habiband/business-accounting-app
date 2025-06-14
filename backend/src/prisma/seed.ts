import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('Customer123!', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      isActive: true,
    },
  });

  const smartphones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      parentId: electronics.id,
      isActive: true,
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Portable computers',
      parentId: electronics.id,
      isActive: true,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      isActive: true,
    },
  });

  // Create products
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The latest iPhone with advanced features and stunning design.',
      price: 999.99,
      comparePrice: 1099.99,
      inventory: 50,
      sku: 'IPHONE15PRO001',
      categoryId: smartphones.id,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      ],
      variants: {
        colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
        storage: ['128GB', '256GB', '512GB', '1TB'],
      },
      weight: 0.187,
      seoData: {
        title: 'iPhone 15 Pro - Latest Apple Smartphone',
        description: 'Buy the new iPhone 15 Pro with advanced camera system and titanium design.',
        keywords: ['iPhone', 'Apple', 'smartphone', 'mobile'],
      },
    },
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Powerful laptop for professionals with M3 Pro chip.',
      price: 2499.99,
      inventory: 25,
      sku: 'MBP16M3001',
      categoryId: laptops.id,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      ],
      variants: {
        colors: ['Space Gray', 'Silver'],
        memory: ['18GB', '36GB'],
        storage: ['512GB', '1TB', '2TB'],
      },
      weight: 2.16,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Premium Android smartphone with S Pen and advanced camera.',
      price: 1199.99,
      inventory: 30,
      sku: 'GALAXYS24U001',
      categoryId: smartphones.id,
      images: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      ],
      variants: {
        colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
        storage: ['256GB', '512GB', '1TB'],
      },
      weight: 0.232,
    },
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-t-shirt',
      description: 'Comfortable and stylish cotton t-shirt for everyday wear.',
      price: 29.99,
      inventory: 100,
      sku: 'TSHIRT001',
      categoryId: clothing.id,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      ],
      variants: {
        colors: ['White', 'Black', 'Navy', 'Gray'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
      weight: 0.2,
    },
    {
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      description: 'Ultra-portable laptop with stunning InfinityEdge display.',
      price: 1299.99,
      inventory: 20,
      sku: 'DELLXPS13001',
      categoryId: laptops.id,
      images: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
      ],
      variants: {
        colors: ['Platinum Silver', 'Frost White'],
        processor: ['Intel i5', 'Intel i7'],
        memory: ['8GB', '16GB', '32GB'],
        storage: ['256GB', '512GB', '1TB'],
      },
      weight: 1.27,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }

  // Create some sample reviews
  const iphone = await prisma.product.findUnique({
    where: { slug: 'iphone-15-pro' },
  });

  if (iphone) {
    await prisma.productReview.upsert({
      where: {
        productId_userId: {
          productId: iphone.id,
          userId: customer.id,
        },
      },
      update: {},
      create: {
        productId: iphone.id,
        userId: customer.id,
        rating: 5,
        title: 'Amazing phone!',
        comment: 'The camera quality is incredible and the titanium design feels premium.',
        isVerified: true,
      },
    });
  }

  // Create coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      name: 'Welcome Discount',
      type: 'PERCENTAGE',
      value: 10,
      minOrderValue: 50,
      usageLimit: 1000,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      name: 'Free Shipping',
      type: 'FREE_SHIPPING',
      value: 0,
      minOrderValue: 25,
      usageLimit: 500,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      isActive: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@ecommerce.com / Admin123!');
  console.log('👤 Customer user: customer@example.com / Customer123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
