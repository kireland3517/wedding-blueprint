import { fetchOneEntry } from "@builder.io/sdk-react";
import { RenderBuilderContent } from "../../components/builder/BuilderContent";
import { notFound } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

interface Props {
  params: Promise<{ page?: string[] }>;
}

export default async function BuilderPage({ params }: Props) {
  const { page } = await params;
  const urlPath = "/" + (page?.join("/") ?? "");

  const content = await fetchOneEntry({
    model: "page",
    apiKey: API_KEY,
    userAttributes: { urlPath },
  });

  if (!content) notFound();

  return <RenderBuilderContent content={content} model="page" />;
}

export const revalidate = 60;
