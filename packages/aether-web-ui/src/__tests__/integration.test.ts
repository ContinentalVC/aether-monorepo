/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { AetherGlassCard } from '../components/AetherGlassCard';
import { Button } from '../components/Button';
import * as packageExports from '../index';

// Test package exports
describe('@aether/web-ui Integration Tests', () => {
  describe('Package Exports', () => {
    it('should export AetherGlassCard component', () => {
      expect(AetherGlassCard).toBeDefined();
      expect(typeof AetherGlassCard).toBe('function');
    });

    it('should export Button component', () => {
      expect(Button).toBeDefined();
      expect(typeof Button).toBe('function');
    });

    it('should export index with all components', () => {
      expect(packageExports).toHaveProperty('AetherGlassCard');
      expect(packageExports).toHaveProperty('Button');
      expect(packageExports).toHaveProperty('Input');
      expect(packageExports).toHaveProperty('Modal');
    });
  });

  describe('Component Integration', () => {
    it('should render AetherGlassCard with basic props', async () => {
      await act(async () => {
        render(
          React.createElement(AetherGlassCard, { title: "Test Card" })
        );
      });

      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    it('should render Button with React.createElement', async () => {
      const handleButtonClick = jest.fn();
      
      await act(async () => {
        render(
          React.createElement(Button, { 
            onClick: handleButtonClick,
            children: 'Click me to test Aether'
          })
        );
      });

      const button = screen.getByText('Click me to test Aether');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
      
      // Test click functionality
      button.click();
      expect(handleButtonClick).toHaveBeenCalledTimes(1);
    });

    it('should render Button with children as third argument', async () => {
      const handleButtonClick = jest.fn();
      
      await act(async () => {
        render(
          React.createElement(Button, { onClick: handleButtonClick }, 'Click me to test Aether')
        );
      });

      const button = screen.getByText('Click me to test Aether');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
      
      // Test click functionality
      button.click();
      expect(handleButtonClick).toHaveBeenCalledTimes(1);
    });

  });

  describe('Module Resolution', () => {
    it('should resolve relative imports correctly', () => {
      // Test that internal imports work
      expect(AetherGlassCard).toBeDefined();
      expect(typeof AetherGlassCard).toBe('function');
    });

    it('should handle styled-components integration', async () => {
      await act(async () => {
        render(
          React.createElement(AetherGlassCard, { title: "Styled Test" })
        );
      });

      expect(screen.getByText('Styled Test')).toBeInTheDocument();
    });
  });

  describe('Component Props', () => {
    it('should handle various prop combinations', async () => {
      await act(async () => {
        render(
          React.createElement(AetherGlassCard, { 
            title: "Complex Card",
            subtitle: "Subtitle",
            badge: "New",
            size: "large",
            variant: "elevated"
          })
        );
      });

      expect(screen.getByText('Complex Card')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should handle style props', async () => {
      const customStyle = { backgroundColor: '#FF0000' };
      
      await act(async () => {
        render(
          React.createElement(AetherGlassCard, { 
            title: "Styled Card",
            style: customStyle
          })
        );
      });

      expect(screen.getByText('Styled Card')).toBeInTheDocument();
    });
  });
}); 