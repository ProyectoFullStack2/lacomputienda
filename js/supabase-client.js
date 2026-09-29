// js/supabase-client.js
const SUPABASE_URL = "https://rkddnzwutymuxnhusmsf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_tJf17OshpakMYWS85f_4bA_OmAXAYWT";

// Guardamos el cliente en window.db para que toda tu app pueda usarlo sin choques
window.db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

