# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Next.js turbopack for faster builds)
- **Build**: `npm run build`
- **Production server**: `npm start`  
- **Linting**: `npm run lint`

Always run `npm run lint` after making code changes to ensure code quality.

## Project Architecture

This is a Next.js 15 frontend application for StarMake AI, a platform for creating social media content with AI assistance.

### Core Technology Stack
- **Framework**: Next.js 15 with App Router
- **UI Components**: Radix UI primitives with custom components
- **Styling**: Tailwind CSS v4 with custom animations
- **State Management**: React Query (@tanstack/react-query) for server state
- **HTTP Client**: Axios with custom interceptors for auth handling
- **Authentication**: JWT tokens with automatic refresh using HTTP-only cookies

### Key Directories

#### `/src/api/`
API layer with organized endpoints by feature:
- `auth/` - Authentication endpoints (login, register, refresh, etc.)
- `reels/` - Instagram reel management and favorites
- `subscriptions/` - Payment and subscription management
- `sandbox/` - AI script generation functionality
- `categories/` - Content categorization

#### `/src/context/`
React contexts for global state:
- `AuthContext.tsx` - Authentication state with automatic token refresh
- `SubscriptionContext.tsx` - Subscription status and limits
- `VideoContext.tsx` - Video player state management

#### `/src/hooks/`
Custom React hooks organized by feature area, following the same structure as `/src/api/`

#### `/src/components/`
- `ui/` - Reusable UI components (Radix-based)
- `auth/` - Authentication forms and guards
- `reel/` - Reel cards, sidebar, and related components
- `payment/` - Payment forms and subscription management
- `script-builder/` - AI-powered script generation interface
- Feature-specific directories following component organization

#### `/src/lib/`
- `axios.ts` - Axios configuration with auth interceptors and automatic token refresh
- `session.ts` - Session management utilities
- `utils.ts` - General utility functions

### Authentication System

The app uses a sophisticated JWT authentication system:

1. **Automatic Token Refresh**: The axios interceptor in `/src/lib/axios.ts` automatically handles 401 errors by refreshing tokens
2. **AuthGuard Components**: Protect routes from unauthorized access
3. **Middleware**: Handles redirects for authenticated users on public routes
4. **Multiple Auth States**: Tracks authentication, loading, and subscription limitation states

### Subscription & Payment Integration

- Users have different subscription tiers (Basic, Premium) affecting feature access
- Payment processing integrated with external payment service
- Subscription limitations enforced through `isLimited` state
- Chatbot access controlled by active subscription status

### API Integration

- Base API URL configured via `NEXT_PUBLIC_API_URL` environment variable
- All API calls include credentials for cookie-based authentication
- Custom error handling for subscription limits (403 errors with specific format)
- Automatic logout on persistent authentication failures

### Component Patterns

- Heavy use of Radix UI for accessible component primitives
- Custom styling with Tailwind CSS and class-variance-authority for component variants
- React Hook Form for form management
- Custom hooks for each API operation following React Query patterns

### Routing Structure

- App Router with nested layouts
- Route groups for authentication pages `(auth)/`
- Dynamic routes for reel details `[shortcode]`
- Protected routes handled by AuthGuard components

### Key Features

1. **Reel Library**: Browse and favorite Instagram reels with category filtering
2. **AI Script Builder**: Generate content scripts using AI assistance  
3. **User Profiles**: Manage subscription plans and view usage
4. **Payment Integration**: Subscription purchase and management
5. **Responsive Design**: Full mobile and desktop support

## Environment Variables

Ensure `NEXT_PUBLIC_API_URL` is configured to point to the backend API.

## Code Conventions

- Use TypeScript for all new code
- Follow existing component structure and naming conventions
- Organize hooks by feature area matching the API structure
- Use custom utility functions in `/src/utils/` for reusable logic
- Maintain consistent error handling patterns established in the codebase