import { Resend } from 'resend';

const getResendClient = () => new Resend(process.env.RESEND_API_KEY);

interface DigestData {
  email: string;
  name: string;
  weeklyAtoms: number;
  totalAtoms: number;
  topTags: { name: string; count: number }[];
  recentInsights: {
    content: string;
    pageTitle: string;
    sourceUrl: string;
    createdAt: string;
  }[];
  suggestedSearches: string[];
}

export async function sendWeeklyDigest(data: DigestData) {
  const { email, name, weeklyAtoms, totalAtoms, topTags, recentInsights, suggestedSearches } = data;

  const firstName = name?.split(' ')[0] || 'Researcher';
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Research Digest</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">
        🔬 Your Weekly Research Digest
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">
        ${weekAgo} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
    </div>
    
    <!-- Stats Card -->
    <div style="background: white; padding: 24px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
      <div style="display: flex; gap: 16px;">
        <div style="flex: 1; background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: #16a34a;">${weeklyAtoms}</div>
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Atoms This Week</div>
        </div>
        <div style="flex: 1; background: #eef2ff; border-radius: 12px; padding: 20px; text-align: center;">
          <div style="font-size: 32px; font-weight: 700; color: #4f46e5;">${totalAtoms}</div>
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Total Library</div>
        </div>
      </div>
    </div>
    
    <!-- Top Tags -->
    ${topTags.length > 0 ? `
    <div style="background: white; padding: 24px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0;">
      <h3 style="margin: 0 0 16px; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
        🏷️ Your Top Topics
      </h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${topTags.slice(0, 6).map(tag => `
          <span style="background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 20px; font-size: 13px;">
            ${tag.name} <span style="color: #94a3b8;">(${tag.count})</span>
          </span>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- Recent Clips -->
    ${recentInsights.length > 0 ? `
    <div style="background: white; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
      <h3 style="margin: 0 0 16px; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
        📚 Recently Captured
      </h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${recentInsights.slice(0, 3).map(insight => `
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px;">
            <p style="margin: 0 0 8px; color: #1e293b; font-size: 14px; line-height: 1.5;">
              "${insight.content.length > 120 ? insight.content.substring(0, 120) + '...' : insight.content}"
            </p>
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              ${insight.pageTitle || new URL(insight.sourceUrl).hostname}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- Suggested Searches -->
    ${suggestedSearches.length > 0 ? `
    <div style="background: white; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
      <h3 style="margin: 0 0 16px; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">
        💡 Try These Searches
      </h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${suggestedSearches.slice(0, 3).map(search => `
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 12px 16px; border-radius: 8px; font-size: 14px; text-align: center;">
            ${search}
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- CTA -->
    <div style="background: white; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://atomaclip.ai'}/app" 
         style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px;">
        Open Your Research Brain →
      </a>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;">
      <p style="margin: 0 0 8px;">
        You're receiving this because you use AtomaClip AI.
      </p>
      <p style="margin: 0;">
        <a href="#" style="color: #6366f1;">Manage preferences</a> • 
        <a href="#" style="color: #6366f1;">Unsubscribe</a>
      </p>
    </div>
    
  </div>
  
</body>
</html>
`;

  try {
    const { data: response, error } = await getResendClient().emails.send({
      from: 'AtomaClip AI <digest@atomaclip.ai>',
      to: email,
      subject: `Your Weekly Digest: ${weeklyAtoms} new atoms captured! 🔬`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: response };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const firstName = name?.split(' ')[0] || 'Researcher';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AtomaClip</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; padding: 40px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
        Welcome to AtomaClip, ${firstName}! 🚀
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 16px 0 0; font-size: 16px; line-height: 1.6;">
        Your personal research brain is ready. Start capturing insights and let AI help you connect the dots.
      </p>
    </div>
    
    <div style="background: white; padding: 32px; border-radius: 16px; margin-top: 20px;">
      <h2 style="margin: 0 0 20px; font-size: 20px; color: #1e293b;">Quick Start Guide</h2>
      
      <div style="display: flex; gap: 16px; margin-bottom: 24px;">
        <div style="width: 40px; height: 40px; background: #eef2ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #4f46e5; flex-shrink: 0;">1</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #1e293b;">Install the Extension</h3>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Add AtomaClip to your browser for one-click capturing.</p>
        </div>
      </div>
      
      <div style="display: flex; gap: 16px; margin-bottom: 24px;">
        <div style="width: 40px; height: 40px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #16a34a; flex-shrink: 0;">2</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #1e293b;">Start Capturing</h3>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Highlight any text, right-click, and select "Capture Insight".</p>
        </div>
      </div>
      
      <div style="display: flex; gap: 16px;">
        <div style="width: 40px; height: 40px; background: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #d97706; flex-shrink: 0;">3</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #1e293b;">Ask Your Research</h3>
          <p style="margin: 0; font-size: 14px; color: #64748b;">Use semantic search to find insights by meaning, not keywords.</p>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; padding: 24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://atomaclip.ai'}/app" 
         style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px;">
        Start Capturing →
      </a>
    </div>
    
  </div>
  
</body>
</html>
`;

  try {
    const { data: response, error } = await getResendClient().emails.send({
      from: 'AtomaClip AI <welcome@atomaclip.ai>',
      to: email,
      subject: `Welcome to AtomaClip, ${firstName}! 🚀`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: response };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}
