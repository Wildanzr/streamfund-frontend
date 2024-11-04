// Global.d.ts for global type declaration

export {};

declare global {
  interface URLProps {
    params: { id: string };
    searchParams: { [key: string]: string | undefined };
  }

  interface ChildrenProps {
    children: React.ReactNode;
  }

  interface Video {
    value: number;
    src: string;
    name: string;
  }
}
