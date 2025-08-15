
// Example API call to test enhanced AI reports
const testEnhancedReport = async () => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      selectedItems: {
        'Carrot': 5,
        'Strawberry': 3,
        'Sprinkler': 1
      },
      gold: 500,
      inGameDate: 'Spring, Day 10',
      currentDate: new Date().toISOString(),
      interactionMode: 'advanced'
    })
  });
  
  const report = await response.json();
  console.log('Generated Report:', report);
};

// Call the test function
testEnhancedReport();
