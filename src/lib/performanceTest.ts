// Performance testing utility
export async function testApiPerformance(url: string, iterations: number = 10) {
  console.log(`🧪 Testing API Performance: ${url}`);
  console.log(`📊 Running ${iterations} iterations...`);
  
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`❌ Request ${i + 1} failed: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      const end = performance.now();
      const duration = end - start;
      times.push(duration);
      
      console.log(`✅ Request ${i + 1}: ${duration.toFixed(2)}ms`);
    } catch (error) {
      console.error(`❌ Request ${i + 1} error:`, error);
    }
  }
  
  if (times.length > 0) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    console.log(`\n📈 Performance Summary:`);
    console.log(`   Average: ${avg.toFixed(2)}ms`);
    console.log(`   Min: ${min.toFixed(2)}ms`);
    console.log(`   Max: ${max.toFixed(2)}ms`);
    console.log(`   Success Rate: ${((times.length / iterations) * 100).toFixed(1)}%`);
  }
}

// Database query performance testing
export async function testQueryPerformance(queryFn: () => Promise<any>, iterations: number = 5) {
  console.log(`🧪 Testing Query Performance`);
  console.log(`📊 Running ${iterations} iterations...`);
  
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    try {
      await queryFn();
      const end = performance.now();
      const duration = end - start;
      times.push(duration);
      
      console.log(`✅ Query ${i + 1}: ${duration.toFixed(2)}ms`);
    } catch (error) {
      console.error(`❌ Query ${i + 1} error:`, error);
    }
  }
  
  if (times.length > 0) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    console.log(`\n📈 Query Performance Summary:`);
    console.log(`   Average: ${avg.toFixed(2)}ms`);
    console.log(`   Min: ${min.toFixed(2)}ms`);
    console.log(`   Max: ${max.toFixed(2)}ms`);
  }
} 