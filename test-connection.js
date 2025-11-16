/**
 * Test script to verify frontend-backend connection
 */

import { api } from './src/services/api.js';

async function testConnection() {
  console.log('🔍 Testing backend connection...');

  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const health = await api.checkHealth();
    console.log('✅ Health check passed:', health);

    // Test incidents endpoint
    console.log('\n2. Testing incidents endpoint...');
    const incidents = await api.getIncidents();
    console.log('✅ Incidents loaded:', incidents.length, 'incidents');

    // Test agents endpoint
    console.log('\n3. Testing agents endpoint...');
    const agents = await api.getAgents();
    console.log('✅ Agents loaded:', agents.length, 'agents');

    // Test stats endpoint
    console.log('\n4. Testing stats endpoint...');
    const stats = await api.getStats();
    console.log('✅ Stats loaded:', stats);

    console.log('\n🎉 All tests passed! Frontend-backend connection is working!');
    return true;

  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    return false;
  }
}

testConnection();