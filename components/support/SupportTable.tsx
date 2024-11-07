import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, trimAddress } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import React from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { formatUnits } from "viem";

export default function SupportTable({
  supports,
}: {
  supports: SupportResponse[];
}) {
  const [, copy] = useCopyToClipboard();
  const handleCopyAddress = (address: string) => {
    copy(address);
    alert("Copied to clipboard");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date/Time</TableHead>
          <TableHead>From</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>TxHash</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {supports && supports.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10">
              No supports received yet
            </TableCell>
          </TableRow>
        ) : (
          supports.map((support: SupportResponse) => (
            <TableRow key={support._id}>
              <TableCell className="whitespace-nowrap">
                {formatDate(support.creted_at)}
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2 items-center">
                  <p>{trimAddress(support.from)}</p>
                  <CopyIcon
                    onClick={() => handleCopyAddress(support.from)}
                    color="gray"
                    size={14}
                    className="cursor-pointer"
                  />
                </div>
              </TableCell>
              <TableCell>{support.message}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatUnits(BigInt(support.amount), support?.token?.decimal)}{" "}
                {support?.token?.symbol}
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2 items-center">
                  <p>{trimAddress(support.hash)}</p>
                  <CopyIcon
                    onClick={() => handleCopyAddress(support.hash)}
                    color="gray"
                    size={14}
                    className="cursor-pointer"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
