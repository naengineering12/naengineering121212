export function getInstantChatReply(message) {
  const m = String(message || '').trim().toLowerCase();
  if (['hi','hello','hey','hy','salam','assalam o alaikum','aoa'].includes(m)) return 'Hello! Welcome to NA Engineering Solutions. How can I help you with our engineering services or general order supplies?';
  if (m.includes('service') || m.includes('what do you do') || m.includes('provide')) return 'NA Engineering Solutions provides Civil Engineering, HVAC, Mechanical Engineering, PEB Works, Electrical Works, Fire Fighting, Safety & Security Systems, industrial maintenance, and General Order Supplies & Services.';
  if (m.includes('general order') || m.includes('suppl')) return 'We supply mechanical and electrical items, hardware and tools, safety/PPE, facility-maintenance products, office supplies, and industrial/project materials according to customer requirements.';
  if (m.includes('contact') || m.includes('email') || m.includes('phone') || m.includes('quote')) return 'For a quotation or detailed requirement, please use the Request a Quote form or contact na.engineeringsolutions2023@gmail.com.';
  return null;
}
