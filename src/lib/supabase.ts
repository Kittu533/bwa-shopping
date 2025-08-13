
import { createClient } from '@supabase/supabase-js'

// filepath: [supabase.ts](http://_vscodecontentref_/1)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";


// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)

export const getImageUrl = (name: string) => {
    const { data } = supabase
        .storage
        .from('belanja')
        .getPublicUrl(`public/brands/${name}`)

    return data.publicUrl
}

export const uploadFile = async (file: File, path: 'brands' | 'products' = 'brands') => {
    if (!file) throw new Error('No file provided');
    const fileType = file.type.split('/')[1] || 'bin';
    const fileName = `${path}-${Date.now()}.${fileType}`;

    const { error } = await supabase.storage
        .from('belanja')
        .upload(`public/${path}/${fileName}`, file, { cacheControl: '3600', upsert: false });

    if (error) throw error; // biar ketangkep try/catch di action
    return fileName;
};
