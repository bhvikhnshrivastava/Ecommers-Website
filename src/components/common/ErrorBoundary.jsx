import { Component } from 'react';
import BrandLogo from '@/components/common/BrandLogo';
import Button from '@/components/common/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Ecaspian encountered an unexpected error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-pearl-100 px-6 text-center">
          <BrandLogo />
          <p className="eyebrow mt-10">A small interruption</p>
          <h1 className="mt-3 max-w-lg font-display text-4xl text-caspian-950">
            We lost our place for a moment.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-7 text-ink-500">
            Something unexpected happened. Reload the store and your bag and wishlist will still be
            waiting for you.
          </p>
          <Button className="mt-7" onClick={() => window.location.reload()}>
            Reload the store
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
