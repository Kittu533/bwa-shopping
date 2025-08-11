import { ReactNode } from 'react';

type LayoutProps = {
    children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    // layout implementation
    return (
        <div>
            {children}
        </div>
    );
}