import { component$, Slot } from "@qwik.dev/core";

import { exampleLinks } from "./example-links";

type ExamplePageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export const ExamplePage = component$<ExamplePageProps>((props) => {
  return (
    <main class="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div class="mx-auto flex max-w-4xl flex-col gap-8">
        <nav class="flex flex-wrap gap-3 text-sm">
          <a class="text-cyan-200 hover:text-white" href="/">
            All examples
          </a>
          {exampleLinks.map((example) => (
            <a
              key={example.href}
              class="text-slate-400 hover:text-white"
              href={example.href}
            >
              {example.title}
            </a>
          ))}
        </nav>

        <header class="space-y-3">
          <p class="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            {props.eyebrow}
          </p>
          <h1 class="text-3xl font-semibold text-white sm:text-5xl">
            {props.title}
          </h1>
          <p class="max-w-3xl text-base leading-7 text-slate-300">
            {props.description}
          </p>
        </header>

        <Slot />
      </div>
    </main>
  );
});
