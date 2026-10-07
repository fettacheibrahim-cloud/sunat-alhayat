const SUPABASE_URL = 'https://yepoakpeqonheksryalx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kPVlHG491QyXLsYhvM7GOw_gJyVphsX';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showMsg(el, text, ok) {
  el.textContent = text;
  el.className = 'msg ' + (ok ? 'ok' : 'err');
  el.hidden = false;
}
async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session;
}
async function logout() {
  await sb.auth.signOut();
  location.href = 'auth.html';
}
