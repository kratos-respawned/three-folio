"use client";
import {
  CreateProjectAction,
  GetImgKitTokenAction,
} from "@/app/admin/actions/project.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { uploadImages } from "@/lib/image-upload";
import { ProjectFormSchema } from "@/schema/projectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
export function NewProject({ token }: { token: string }) {
  const form = useForm<ProjectFormSchema>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
    },
  });
  const { execute: getImgToken } = useServerAction(GetImgKitTokenAction);
  const { execute: createProject } = useServerAction(CreateProjectAction);
  const handleSubmit = async (data: ProjectFormSchema) => {
    if (!data.images.length) {
      toast.error("Error", "No images to upload");
      return;
    }
    toast.success("Uploading images", "Please wait");
    const [resp, error] = await getImgToken({
      items: data.images.length,
      token,
    });
    if (error) {
      alert(error.message);
      return;
    }
    const imageData = await uploadImages(data.images, resp);
    const [, saveError] = await createProject({
      name: data.name,
      description: data.description,
      images: imageData,
      token,
    });
    if (saveError) {
      toast.error("Error", saveError.message);
      return;
    }
    toast.success("Success", "Images uploaded successfully");
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const isPending = form.formState.isSubmitting;
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(state) => {
        if (form.formState.isSubmitting) {
          return;
        }
        setDialogOpen(state);
        if (!form.formState.isDirty) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new Project</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title of the project" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Description of the project"
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Input
                        accept="image/png, image/gif, image/jpeg"
                        type="file"
                        multiple
                        className="flex-1"
                        {...form.register("images")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  {isPending ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
// const ImageUploader = () => {
//   async function handleUpload(data: CarouselSchema) {
//     if (!data.images.length) {
//       toast.error("Error", "No images to upload");
//       return;
//     }
//     toast.success("Uploading images", "Please wait");
//     const [resp, error] = await execute({
//       items: data.images.length,
//     });
//     if (error) {
//       toast.error("Error", error.message);
//       return;
//     }
//     const imageData = await uploadImages(data.images, resp);
//     const [, saveError] = await saveImageQuery({
//       blogId,
//       images: imageData,
//     });
//     if (saveError) {
//       toast.error("Error", saveError.message);
//       return;
//     }
//     toast.success("Success", "Images uploaded successfully");
//     form.reset();
//     await refetch();
//   }
//   return <></>;
// };
