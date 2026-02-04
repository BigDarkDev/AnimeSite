/**
 * Test script to check if Consumet API is working
 * Run this with: node test-api.js
 */

async function testConsumetAPI() {
  console.log('🔍 Testing Consumet API...\n');
  
  // Test 1: Search for a popular anime
  console.log('Test 1: Searching for "Naruto"...');
  try {
    const searchResponse = await fetch('https://api.consumet.org/anime/gogoanime/naruto');
    const searchData = await searchResponse.json();
    
    if (searchData.results && searchData.results.length > 0) {
      console.log('✅ Search works! Found:', searchData.results[0].title);
      console.log('   Anime ID:', searchData.results[0].id);
      
      // Test 2: Get episodes
      const animeId = searchData.results[0].id;
      console.log('\nTest 2: Getting episodes for:', animeId);
      
      const episodesResponse = await fetch(`https://api.consumet.org/anime/gogoanime/info/${animeId}`);
      const episodesData = await episodesResponse.json();
      
      if (episodesData.episodes && episodesData.episodes.length > 0) {
        console.log('✅ Episodes found! Total:', episodesData.episodes.length);
        console.log('   First episode ID:', episodesData.episodes[0].id);
        
        // Test 3: Get streaming link
        const episodeId = episodesData.episodes[0].id;
        console.log('\nTest 3: Getting streaming link for:', episodeId);
        
        const streamResponse = await fetch(`https://api.consumet.org/anime/gogoanime/watch/${episodeId}`);
        const streamData = await streamResponse.json();
        
        if (streamData.sources && streamData.sources.length > 0) {
          console.log('✅ Streaming link found!');
          console.log('   URL:', streamData.sources[0].url);
          console.log('\n🎉 All tests passed! The API is working correctly.');
        } else {
          console.log('❌ No streaming sources found');
        }
      } else {
        console.log('❌ No episodes found');
      }
    } else {
      console.log('❌ No search results found');
    }
  } catch (error) {
    console.log('❌ API Error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Consumet API might be down');
    console.log('2. Your internet connection might be blocking the API');
    console.log('3. The API URL might have changed');
  }
}

testConsumetAPI();
