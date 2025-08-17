// Cloudflare Pages Function: /api/test-analyze
import { CloudflareJSONHandler } from '../../src/lib/cloudflare-json-handler';

export const onRequestPost: PagesFunction = async () => {
  const response = {
    reportId: `TEST-${Date.now()}`,
    publicationDate: new Date().toISOString(),
    mainTitle: 'Test Report - API Working',
    subTitle: 'SIMPLE TEST RESPONSE',
    visualAnchor: '🧪',
    playerProfile: {
      title: 'Test Profile',
      archetype: 'Test User',
      summary: 'This is a test response to verify API connectivity.'
    },
    midBreakerQuote: 'API is working correctly!',
    sections: [
      {
        id: 'test_section',
        title: 'Test Section',
        points: [
          { action: 'API responding', reasoning: 'Endpoint returns JSON', tags: ['Test'] }
        ]
      }
    ],
    footerAnalysis: {
      title: 'Test Complete',
      conclusion: 'API route functions as expected.',
      callToAction: 'Proceed to integrate Gemini.'
    }
  };

  return CloudflareJSONHandler.createResponse(response, 200);
};

