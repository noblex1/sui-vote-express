import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, LogOut } from "lucide-react";

export function WalletConnection() {
  const account = useCurrentAccount();

  if (account) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Connected</p>
                <p className="text-xs text-muted-foreground font-mono break-all sm:break-normal">
                  <span className="sm:hidden">{account.address.slice(0, 12)}...{account.address.slice(-8)}</span>
                  <span className="hidden sm:inline">{account.address.slice(0, 8)}...{account.address.slice(-6)}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end">
              <ConnectButton connectText="Switch Wallet" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-lg">
      <CardContent className="p-4 sm:p-6 text-center">
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
            <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">Connect Your Wallet</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2 sm:px-0">
              Connect your Sui wallet to create polls and vote
            </p>
          </div>
          <ConnectButton 
            connectText={
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 glow-primary">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}