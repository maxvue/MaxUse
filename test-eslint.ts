export function test() {
    const raw_default_value: any = {};
    const ulid = () => 'x';
    if (typeof raw_default_value === 'object') 
        for (const k in raw_default_value) 
            if (raw_default_value[k] === 'ulid') 
                raw_default_value[k] = ulid().toLowerCase();
            
        
    
}
