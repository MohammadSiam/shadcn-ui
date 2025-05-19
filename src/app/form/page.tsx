"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  username: z.string().min(2, { message: "At lest two character required" }),
  email: z.string().email("Invalid Email Address"),
  age: z.coerce.number().min(18, "You must be 18 years old"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  address: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "state is required"),
  }),
  hobbies: z.array(
    z.object({
      name: z.string().min(1, "Hobby Name is required"),
      years: z.coerce.number().min(1, "Must be at least 1 year"),
    })
  ),
  tnc: z.boolean(),
});

export default function FormComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      age: undefined,
      gender: undefined,
      address: { city: "", state: "" },
      hobbies: [{ name: "", years: undefined }],
      tnc: false,
    },
  });
  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });
  const hobbies = watch("hobbies");
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div>
      <Card className="w-1/2 mx-auto my-20">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="user name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Age"
                        {...field}
                        value={field.value === undefined ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("address.city") && (
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div>
                {fields.map((field, index) => (
                  <div key={field.id} className="mt-2">
                    <FormField
                      control={control}
                      name={`hobbies.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hobby Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Hobby Name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`hobbies.${index}.years`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Years"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <Button
                        className="mt-2"
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                {(() => {
                  const last = hobbies[hobbies.length - 1];
                  return last && last.name === "" && !last.years ? null : (
                    <Button
                      className="mt-2"
                      type="button"
                      onClick={() => append({ name: "", years: 0 })}
                    >
                      Add
                    </Button>
                  );
                })()}
              </div>

              <FormField
                control={form.control}
                name="tnc"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        id="tnc"
                        checked={field.value ?? ""}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="tnc">
                      Accept Terms & Conditions
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("tnc") === true && (
                <Button type="submit">Submit</Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
