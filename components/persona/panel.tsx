'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '~/lib/utils';
import { fetchNFTInfoFromURL } from '~/actions/fetchNFTInfoFromURL';
import { generatePersona } from '~/actions/generatePersona';
import { Icons } from '~/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { personaAtom, profileAtom } from '~/states/persona';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  nftUrl: z.string().url(),
});

export interface ProfilePaneProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ProfilePane({ className }: ProfilePaneProps) {
  const [profile, setProfile] = useAtom(profileAtom);
  const [persona, setPersona] = useAtom(personaAtom);

  const defaultValues = useMemo(
    () => (profile ? { name: profile.name, nftUrl: profile.nft.url } : undefined),
    [profile],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // defaultValues are being loaded from `localStorage` after the form is initialized
  useEffect(() => {
    if (profile) {
      form.setValue('name', profile.name);
      form.setValue('nftUrl', profile.nft.url);
    }
  }, [defaultValues]);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async ({ name, nftUrl }: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const nft = await fetchNFTInfoFromURL(nftUrl);
      setProfile({ name, nft });

      const { persona } = await generatePersona({ name, nft });
      setPersona(persona);
    } catch (err) {
      const error = err as Error;
      form.setError('nftUrl', { message: error.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('', className)}>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Enter Your PFP Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Clone{"'"}s Name</FormLabel>
                  <FormControl>
                    <Input placeholder="vbuterin" {...field} />
                  </FormControl>
                  <FormDescription>Your Clone{"'"}s unique name.</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nftUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NFT URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>Which chain is your NFT on?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="col-span-2" type="submit">
              Confirm
            </Button>
          </CardContent>

          <Separator />
          <CardHeader>
            <CardTitle>Your Clone in Alterim</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col space-y-4 flex-1 overflow-y-scroll">
            <div className="flex flex-row space-x-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile?.nft.imageUrl} />
                <AvatarFallback className="text-muted-foreground text-center"></AvatarFallback>
              </Avatar>
              {profile ? (
                <div className="flex flex-col flex-1 justify-center">
                  <p className="font-bold text-lg mb-2">{profile.nft.name}</p>
                  <p>
                    {profile.nft.traits.map((it) => (
                      <Badge key={it.name} className="mr-2 mb-1" variant="outline">
                        {it.name}: {it.value}
                      </Badge>
                    ))}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center">
                  <p className="text-muted-foreground">Please enter your PFP info to continue.</p>
                </div>
              )}
            </div>
            <Label className="pt-8 text-muted-foreground">AI-Generated Persona</Label>
            <pre
              className="flex-1 p-4 bg-muted max-w-full rounded-sm font-mono text-sm overflow-y-scroll overflow-x-hidden"
              style={{ textWrap: 'balance' }}
            >
              {loading ? (
                <div className="w-full h-full flex flex-row space-x-2 justify-center items-center">
                  <Icons.spinner className="animate-spin w-4 h-4" />
                  <span>Generating...</span>
                </div>
              ) : (
                persona
              )}
            </pre>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
