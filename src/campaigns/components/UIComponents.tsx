import React from 'react';
import { C } from '../design';

export function Badge({ color, bg, border, children }: {
    color: string; bg: string; border: string; children: React.ReactNode;
}) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: bg, color, border: `1px solid ${border}`, fontSize: '13px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.02em' }}>
            {children}
        </span>
    );
}

export function SectionHeader({ icon, title, subtitle, action }: {
    icon?: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon && <span style={{ color: C.neutralMid, display: 'flex', flexShrink: 0 }}>{icon}</span>}
                <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>{title}</div>
                    {subtitle && <div style={{ fontSize: '13px', color: C.textSoft, marginTop: '2px' }}>{subtitle}</div>}
                </div>
            </div>
            {action}
        </div>
    );
}
