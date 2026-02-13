# Terra Local Website Requirements Document

## 1. Application Overview

### 1.1 Application Name
Terra Local

### 1.2 Application Description
Terra Local is a premium organic food e-commerce platform that positions itself as a food movement rather than a conventional online grocery store. The platform connects Indian organic farmers directly with consumers, emphasizing authenticity, sustainability, and emotional connection to food sources. The website features a cinematic, bold design language with strong visual hierarchy and confident messaging that reflects Indian agricultural heritage combined with premium execution standards.

### 1.3 Application Type
Single Page Application (SPA) with view switching and URL updates, featuring multiple pages including Home, Products Listing, Product Detail, Today's Deals, About, Cart, Checkout, and Search functionality.

## 2. Core Features

### 2.1 Home Page
- Cinematic hero section with Indian farmland imagery at golden hour, featuring bold serif typography and clear value proposition
- Trust strip displaying key brand credentials (Certified Organic, Direct from Farmers, Delivered Fresh, Trusted by 2,000+ Families)
- Immersive category grid with large image blocks and hover effects
- Brand statement block with minimal design for rhythm break
- Curated daily selection showcase with 4-column product grid
- About preview section with farmer portrait and human storytelling
- Testimonials section with social proof and rating display
- Newsletter subscription module with movement-focused messaging
- Trust commitment grid highlighting organic practices, ethical sourcing, eco packaging, and responsible distribution
- Deep forest green footer with 4-column layout

### 2.2 Products Listing Page (PLP)
- Hero header with brand language (The Harvest)
- Filter bar with category options (All, Vegetables, Fruits, Dairy, Grains, Oils)
- Sort functionality (Popularity, Price Low to High, Price High to Low, Newest First, Customer Rating)
- 4-column product grid with cinematic card design
- Product cards displaying image, name, origin, rating, and price
- Load more functionality with branded text link

### 2.3 Product Detail Page (PDP)
- Two-column layout with large product imagery and thumbnail navigation
- Product information including title, subtitle, rating, price, and quantity selector
- Add to Cart and Buy Now action buttons
- Trust strip with key value propositions
- Editorial storytelling section (From the Soil) describing product origin and farming method
- Product details grid (Origin, Weight, Shelf Life, Storage, Farming Method, Certification)
- Customer reviews section with rating display and review submission capability
- Related products recommendation carousel

### 2.4 Today's Deals Page
- Season's Selection header with supporting text
- Product grid matching PLP style
- No countdown timers or aggressive urgency tactics

### 2.5 About Page
- Full-width hero section with brand philosophy statement
- Philosophy section with stacked value statements
- Founder note with personal message
- Farm partnership section with split layout (image and text)
- Sustainability commitment grid
- Closing statement with emotional connection messaging

### 2.6 Cart Page
- Your Harvest Basket header
- Two-column layout with cart items list and order summary
- Item management (quantity adjustment, removal)
- Delivery progress indicator
- Proceed to checkout action
- Empty state with exploration prompt

### 2.7 Checkout Flow
- Progress bar (Shipping → Payment → Review)
- Shipping information form with inline validation
- Payment method selection (UPI, Card, COD)
- Order review with edit capabilities
- Success page with order confirmation

### 2.8 Search System
- Navbar expandable search with debounced input (250ms after 2 characters)
- Search ranking priority: Exact match, Starts-with, Partial, Category, Tags, Description
- Dropdown results showing max 5 products and 3 categories
- Dedicated search results page with PLP-style grid
- Mobile full-screen overlay search

## 3. Design Specifications

### 3.1 Layout Standards
- Max width: 1280px
- Side padding: 80px desktop / 24px mobile
- Section spacing: 120px desktop / 80px mobile
- Container radius: 20px
- Card radius: 16px

### 3.2 Color Palette
- Primary: Forest Green
- Secondary: Burnt Orange
- Background: Warm Card White, Soft Sand
- Footer: Deep Forest with subtle gradient
- Text: Muted Sand (on dark backgrounds)

### 3.3 Typography
- Headlines: Large serif typeface
- Body: Clean sans-serif
- Emphasis on vertical rhythm and intentional spacing

### 3.4 Visual Effects
- Image overlays with grain texture (3% opacity) and vignette
- Hover effects: 4px lift, 1.03 zoom, shadow increase
- Transition timing: 0.4-0.5s ease
- Section fade-in animations
- No bounce or flashy motion

### 3.5 Component Styling
- Minimal borders and outlines
- Subtle shadows and glows
- Forest green focus rings on form inputs
- Burnt orange underlines on hover for links
- Single badge per product (max), muted burnt orange, small uppercase

## 4. Technical Architecture

### 4.1 Application Structure
- Single Page Application with client-side routing
- URL updates for each view
- Smooth fade transitions between pages (0.4s)
- Scroll to top on page navigation

### 4.2 Responsive Behavior
- Desktop-first approach with mobile adaptations
- Grid columns adjust: 4 columns desktop → responsive mobile layout
- Mobile search becomes full-screen overlay
- Touch-optimized interactions for mobile devices

### 4.3 Performance Considerations
- Image lazy loading
- Debounced search input
- Smooth animations without performance impact
- Optimized asset delivery

## 5. User Experience Principles

### 5.1 Brand Voice
- Confident and rooted, not polite or generic
- Purpose-driven and movement-focused
- Indian at core with premium execution
- Emotional authority over transactional messaging

### 5.2 Interaction Patterns
- Minimal friction in user flows
- Clear visual hierarchy
- Intentional use of whitespace
- Cinematic visual storytelling
- Human authenticity through farmer profiles and testimonials

### 5.3 Content Strategy
- Movement language over marketplace terminology
- Storytelling approach to product descriptions
- Emphasis on origin, farming practices, and sustainability
- Social proof through ratings and testimonials
- Educational content about organic practices

## 6. Functional Requirements

### 6.1 Product Management
- Product categorization and filtering
- Product search with intelligent ranking
- Product detail display with comprehensive information
- Related product recommendations

### 6.2 Shopping Experience
- Add to cart functionality
- Cart management (quantity adjustment, item removal)
- Delivery threshold tracking (free shipping above ₹999)
- Checkout flow with multiple payment options

### 6.3 Content Display
- Category browsing
- Daily deals/seasonal selection showcase
- Brand story and values communication
- Farmer partnership highlights
- Customer testimonials and ratings

### 6.4 User Engagement
- Newsletter subscription
- Review submission capability
- Search functionality
- Navigation between pages with smooth transitions

## 7. Quality Standards

### 7.1 Visual Quality
- Every section must carry emotional weight
- No visual emptiness or timid copy
- Cinematic imagery with intentional composition
- Strong contrast and vertical rhythm

### 7.2 Experience Quality
- Movement feel, not store feel
- Premium execution throughout
- Confident tone in all messaging
- Rooted in Indian agricultural values

### 7.3 Technical Quality
- Smooth animations and transitions
- Responsive across devices
- Fast load times
- Reliable search and filtering