"use client";

import { DeleteProjectAction } from "@/app/admin/actions/project.actions";
import { Loader } from "lucide-react";
import { useServerAction } from "zsa-react";
import { Button } from "./ui/button";

export const DeleteButton = ({
  id,
  token,
}: {
  id: string;
  token: string | undefined;
}) => {
  const { execute, isPending } = useServerAction(DeleteProjectAction);
  if (!token) return null;
  return (
    <Button
      onClick={async () => await execute({ id, token })}
      variant={"destructive"}
    >
      {isPending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" /> Deleting
        </>
      ) : (
        "Delete"
      )}
    </Button>
  );
};
