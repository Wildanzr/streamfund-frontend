import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getExplorer, trimAddress } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { formatUnits } from "viem";

export default function SupportTable({
  supports,
}: {
  supports: SupportResponse[];
}) {
  const explorer = getExplorer();
  const [, copy] = useCopyToClipboard();

  const handleCopyAddress = (address: string) => {
    copy(address).then(() => {
      alert("Address copied to clipboard");
    });
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
                  <Link
                    className="hover:underline"
                    href={`${explorer.url}/address/${support.hash}`}
                    target="_blank"
                  >
                    {trimAddress(support.from)}
                  </Link>

                  <CopyIcon
                    onClick={() => handleCopyAddress(support.from)}
                    color="white"
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
                  <Link
                    className="hover:underline"
                    href={`${explorer.url}/tx/${support.hash}`}
                    target="_blank"
                  >
                    {trimAddress(support.hash)}
                  </Link>

                  <CopyIcon
                    onClick={() => handleCopyAddress(support.from)}
                    color="white"
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
