import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, LogOut } from "lucide-react";

export function WalletConnection() {
  const account = useCurrentAccount();

  if (account) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-lg">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Connected</p>
              <p className="text-xs text-muted-foreground font-mono">
                {account.address.slice(0, 8)}...{account.address.slice(-6)}
              </p>
            </div>
          </div>
          <ConnectButton connectText="Switch Wallet" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-lg">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground mb-4">
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