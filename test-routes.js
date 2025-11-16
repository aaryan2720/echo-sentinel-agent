/**
 * Route validation test
 */
import React from 'react';
import Landing from './src/pages/Landing';
import Dashboard from './src/pages/Dashboard';
import Agents from './src/pages/Agents';

console.log('✅ Route validation:');
console.log('- Landing component:', typeof Landing);
console.log('- Dashboard component:', typeof Dashboard);  
console.log('- Agents component:', typeof Agents);

// Check for any obvious import issues
try {
  const testComponents = {
    Landing,
    Dashboard, 
    Agents
  };
  
  Object.entries(testComponents).forEach(([name, component]) => {
    if (typeof component !== 'function') {
      console.error(`❌ ${name} is not a valid React component`);
    } else {
      console.log(`✅ ${name} component is valid`);
    }
  });
  
} catch (error) {
  console.error('❌ Route validation failed:', error);
}