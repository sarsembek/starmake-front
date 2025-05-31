export default function PaymentLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <div className="flex flex-col min-h-screen">{children}</div>;
}
