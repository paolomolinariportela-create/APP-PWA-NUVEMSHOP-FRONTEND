
export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '24px', flexShrink: 0 }}>
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: checked ? '#10B981' : '#E5E7EB', transition: '.3s', borderRadius: '34px' }} />
            <span style={{ position: 'absolute', height: '18px', width: '18px', left: '3px', bottom: '3px', backgroundColor: 'white', transition: '.3s', borderRadius: '50%', transform: checked ? 'translateX(22px)' : 'translateX(0px)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
        </label>
    );
}
