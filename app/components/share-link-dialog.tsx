import { useState, useEffect, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Save, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { toPng } from "html-to-image";

interface ShareLinkDialogProps {
  url: string;
  logoUrl?: string;
  open: boolean;
  title?: string;
  setOpen: (isOpen: boolean) => void;
}

export default function ShareLinkDialog({
  url,
  logoUrl = "/linky-logo.svg",
  open,
  title = "Linky",
  setOpen,
}: ShareLinkDialogProps) {
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = title + " QR-Code.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied to clipboard",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "There was an error copying the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="flex flex-grow gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={url} readOnly className="" />
          </div>
          <Button
            size="sm"
            className="px-3 basis-1/12"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div ref={ref} className="qr-code">
            <QRCodeSVG
              value={url}
              size={200}
              marginSize={2}
              level={"H"}
              imageSettings={{
                src: logoUrl,
                x: undefined,
                y: undefined,
                height: 60,
                width: 60,
                excavate: true,
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Scan with your phone camera to share
          </p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button variant="outline" className="basis-1/2" onClick={onButtonClick}>
            <Save className="mr-2 h-4 w-4" />
            Save QR
          </Button>
          <Button onClick={shareToWhatsApp} className="basis-1/2">
            <Share2 className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
