"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  AboutSection,
  ApproachSection,
  CapabilitiesSection,
  ClosingSection,
  HeroSection,
  HomepageSection,
  IntroSection,
  MediaSection,
  NumberedItem,
  RichTextSection,
  WorkSection,
} from "@/lib/content/schema";

const fieldClass =
  "h-11 min-h-11 rounded-[13px] bg-white px-3 text-[1rem]";
const areaClass = "min-h-28 rounded-[13px] bg-white px-3 py-3 text-[1rem]";

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </div>
  );
}

function TextareaField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={areaClass}
      />
    </div>
  );
}

function ParagraphsField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{label}</p>
      {value.map((paragraph, index) => (
        <div key={`${id}-${index}`} className="grid gap-2">
          <Label htmlFor={`${id}-${index}`}>Paragraph {index + 1}</Label>
          <Textarea
            id={`${id}-${index}`}
            value={paragraph}
            onChange={(event) => {
              const next = [...value];
              next[index] = event.target.value;
              onChange(next);
            }}
            className={areaClass}
          />
          <Button
            type="button"
            variant="outline"
            size="cta"
            onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
            disabled={value.length <= 1}
          >
            Remove paragraph
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="cta"
        onClick={() => onChange([...value, ""])}
        disabled={value.length >= 12}
      >
        Add paragraph
      </Button>
    </div>
  );
}

function ImageField({
  id,
  label,
  value,
  altValue,
  altLabel,
  onChange,
  onAltChange,
  csrfToken,
}: {
  id: string;
  label: string;
  value: string;
  altValue?: string;
  altLabel?: string;
  onChange: (value: string) => void;
  onAltChange?: (value: string) => void;
  csrfToken: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setStatus(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken },
        body,
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setStatus(payload.error ?? "The image could not be uploaded.");
        return;
      }
      onChange(payload.url);
      setStatus("Image uploaded.");
    } catch {
      setStatus("The image could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-[16px] bg-surface/70 p-4">
      <p className="text-sm font-medium">{label}</p>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="max-h-48 w-full rounded-[12px] object-contain bg-white"
        />
      ) : (
        <p className="text-muted-text text-sm">No image yet.</p>
      )}
      <TextField
        id={`${id}-url`}
        label="Image URL"
        value={value}
        onChange={onChange}
      />
      {onAltChange && altLabel ? (
        <TextField
          id={`${id}-alt`}
          label={altLabel}
          value={altValue ?? ""}
          onChange={onAltChange}
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex h-11 min-h-11 cursor-pointer items-center rounded-[13px] border border-ink/15 px-4 text-sm font-semibold">
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              void onFile(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
          />
        </label>
        <Button
          type="button"
          variant="outline"
          size="cta"
          onClick={() => onChange("")}
          disabled={!value}
        >
          Clear image
        </Button>
      </div>
      {status ? (
        <p role="status" className="text-sm text-ink/80">
          {status}
        </p>
      ) : null}
    </div>
  );
}

function NumberedListEditor({
  id,
  label,
  items,
  onChange,
}: {
  id: string;
  label: string;
  items: NumberedItem[];
  onChange: (items: NumberedItem[]) => void;
}) {
  return (
    <div className="grid gap-4">
      <p className="text-sm font-medium">{label}</p>
      {items.map((item, index) => (
        <div key={`${id}-${index}`} className="grid gap-3 rounded-[16px] bg-surface/70 p-4">
          <TextField
            id={`${id}-number-${index}`}
            label="Number"
            value={item.number}
            onChange={(value) => {
              const next = [...items];
              next[index] = { ...item, number: value };
              onChange(next);
            }}
          />
          <TextField
            id={`${id}-title-${index}`}
            label="Title"
            value={item.title}
            onChange={(value) => {
              const next = [...items];
              next[index] = { ...item, title: value };
              onChange(next);
            }}
          />
          <TextareaField
            id={`${id}-copy-${index}`}
            label="Copy"
            value={item.copy}
            onChange={(value) => {
              const next = [...items];
              next[index] = { ...item, copy: value };
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="cta"
            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            disabled={items.length <= 1}
          >
            Remove item
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="cta"
        onClick={() =>
          onChange([
            ...items,
            {
              number: String(items.length + 1).padStart(2, "0"),
              title: "",
              copy: "",
            },
          ])
        }
        disabled={items.length >= 16}
      >
        Add item
      </Button>
    </div>
  );
}

function LinkPair({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: { label: string; href: string };
  onChange: (value: { label: string; href: string }) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <TextField
        id={`${id}-label`}
        label={`${label} label`}
        value={value.label}
        onChange={(next) => onChange({ ...value, label: next })}
      />
      <TextField
        id={`${id}-href`}
        label={`${label} link`}
        value={value.href}
        onChange={(next) => onChange({ ...value, href: next })}
      />
    </div>
  );
}

function SectionEditor({
  section,
  onChange,
  csrfToken,
}: {
  section: HomepageSection;
  onChange: (section: HomepageSection) => void;
  csrfToken: string;
}) {
  return (
    <div className="grid gap-6">
      <TextField
        id={`${section.id}-anchor`}
        label="Page anchor (optional, without #)"
        value={section.anchor}
        onChange={(anchor) => onChange({ ...section, anchor })}
      />
      {section.type === "hero" ? (
        <HeroFields section={section} onChange={onChange} csrfToken={csrfToken} />
      ) : null}
      {section.type === "intro" ? (
        <IntroFields section={section} onChange={onChange} />
      ) : null}
      {section.type === "work" ? (
        <WorkFields section={section} onChange={onChange} csrfToken={csrfToken} />
      ) : null}
      {section.type === "capabilities" ? (
        <CapabilitiesFields section={section} onChange={onChange} />
      ) : null}
      {section.type === "approach" ? (
        <ApproachFields section={section} onChange={onChange} />
      ) : null}
      {section.type === "about" ? (
        <AboutFields section={section} onChange={onChange} csrfToken={csrfToken} />
      ) : null}
      {section.type === "closing" ? (
        <ClosingFields section={section} onChange={onChange} csrfToken={csrfToken} />
      ) : null}
      {section.type === "richText" ? (
        <RichTextFields section={section} onChange={onChange} />
      ) : null}
      {section.type === "media" ? (
        <MediaFields section={section} onChange={onChange} csrfToken={csrfToken} />
      ) : null}
    </div>
  );
}

function HeroFields({
  section,
  onChange,
  csrfToken,
}: {
  section: HeroSection;
  onChange: (section: HeroSection) => void;
  csrfToken: string;
}) {
  return (
    <>
      <TextField id="hero-kicker" label="Kicker" value={section.kicker} onChange={(kicker) => onChange({ ...section, kicker })} />
      <TextareaField id="hero-headline" label="Headline" value={section.headline} onChange={(headline) => onChange({ ...section, headline })} />
      <TextareaField id="hero-supporting" label="Supporting copy" value={section.supporting} onChange={(supporting) => onChange({ ...section, supporting })} />
      <LinkPair id="hero-primary" label="Primary button" value={section.primaryCta} onChange={(primaryCta) => onChange({ ...section, primaryCta })} />
      <LinkPair id="hero-secondary" label="Secondary button" value={section.secondaryCta} onChange={(secondaryCta) => onChange({ ...section, secondaryCta })} />
      <ImageField
        id="hero-image"
        label="Hero image (leave empty to keep the default visual)"
        value={section.imageSrc}
        altValue={section.imageAlt}
        altLabel="Image alternative text"
        onChange={(imageSrc) => onChange({ ...section, imageSrc })}
        onAltChange={(imageAlt) => onChange({ ...section, imageAlt })}
        csrfToken={csrfToken}
      />
    </>
  );
}

function IntroFields({
  section,
  onChange,
}: {
  section: IntroSection;
  onChange: (section: IntroSection) => void;
}) {
  return (
    <>
      <TextField id="intro-heading" label="Heading" value={section.heading} onChange={(heading) => onChange({ ...section, heading })} />
      <ParagraphsField id="intro-copy" label="Paragraphs" value={section.paragraphs} onChange={(paragraphs) => onChange({ ...section, paragraphs })} />
    </>
  );
}

function WorkFields({
  section,
  onChange,
  csrfToken,
}: {
  section: WorkSection;
  onChange: (section: WorkSection) => void;
  csrfToken: string;
}) {
  return (
    <>
      <TextField id="work-eyebrow" label="Eyebrow" value={section.eyebrow} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
      <TextField id="work-name" label="Name (optional)" value={section.name} onChange={(name) => onChange({ ...section, name })} />
      <TextField id="work-partner" label="Partner (optional)" value={section.partner} onChange={(partner) => onChange({ ...section, partner })} />
      <TextField id="work-status" label="Status" value={section.status} onChange={(status) => onChange({ ...section, status })} />
      <TextareaField id="work-description" label="Description" value={section.description} onChange={(description) => onChange({ ...section, description })} />
      <TextField id="work-role" label="Role" value={section.role} onChange={(role) => onChange({ ...section, role })} />
      <TextField id="work-video" label="Video URL" value={section.video} onChange={(video) => onChange({ ...section, video })} />
      <TextField id="work-launch" label="Launch URL" value={section.launchUrl} onChange={(launchUrl) => onChange({ ...section, launchUrl })} />
      <TextField id="work-appstore" label="App Store URL" value={section.appStoreUrl} onChange={(appStoreUrl) => onChange({ ...section, appStoreUrl })} />
      <TextField id="work-casestudy" label="Case study URL" value={section.caseStudyUrl} onChange={(caseStudyUrl) => onChange({ ...section, caseStudyUrl })} />
      <ImageField
        id="work-shot"
        label="Screenshot (leave empty to keep the product frame)"
        value={section.screenshot}
        altValue={section.screenshotAlt}
        altLabel="Screenshot alternative text"
        onChange={(screenshot) => onChange({ ...section, screenshot })}
        onAltChange={(screenshotAlt) => onChange({ ...section, screenshotAlt })}
        csrfToken={csrfToken}
      />
      <TextField
        id="work-badge"
        label="Frame badge"
        value={section.frame.badge}
        onChange={(badge) => onChange({ ...section, frame: { ...section.frame, badge } })}
      />
      <TextField
        id="work-footer-label"
        label="Frame footer label"
        value={section.frame.footerLabel}
        onChange={(footerLabel) => onChange({ ...section, frame: { ...section.frame, footerLabel } })}
      />
      <TextareaField
        id="work-footer-copy"
        label="Frame footer copy"
        value={section.frame.footerCopy}
        onChange={(footerCopy) => onChange({ ...section, frame: { ...section.frame, footerCopy } })}
      />
      <div className="grid gap-4">
        <p className="text-sm font-medium">Frame cards</p>
        {section.frame.cards.map((card, index) => (
          <div key={`card-${index}`} className="grid gap-3 rounded-[16px] bg-surface/70 p-4">
            <TextField
              id={`card-title-${index}`}
              label="Card title"
              value={card.title}
              onChange={(title) => {
                const cards = [...section.frame.cards];
                cards[index] = { ...card, title };
                onChange({ ...section, frame: { ...section.frame, cards } });
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="cta"
              onClick={() =>
                onChange({
                  ...section,
                  frame: {
                    ...section.frame,
                    cards: section.frame.cards.filter((_, itemIndex) => itemIndex !== index),
                  },
                })
              }
              disabled={section.frame.cards.length <= 1}
            >
              Remove card
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="cta"
          onClick={() =>
            onChange({
              ...section,
              frame: {
                ...section.frame,
                cards: [...section.frame.cards, { title: "", lines: ["", ""] }],
              },
            })
          }
        >
          Add card
        </Button>
      </div>
    </>
  );
}

function CapabilitiesFields({
  section,
  onChange,
}: {
  section: CapabilitiesSection;
  onChange: (section: CapabilitiesSection) => void;
}) {
  return (
    <>
      <TextField id="cap-eyebrow" label="Eyebrow" value={section.eyebrow} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
      <TextField id="cap-heading" label="Heading" value={section.heading} onChange={(heading) => onChange({ ...section, heading })} />
      <NumberedListEditor id="cap-items" label="Capabilities" items={section.items} onChange={(items) => onChange({ ...section, items })} />
    </>
  );
}

function ApproachFields({
  section,
  onChange,
}: {
  section: ApproachSection;
  onChange: (section: ApproachSection) => void;
}) {
  return (
    <>
      <TextField id="ap-eyebrow" label="Eyebrow" value={section.eyebrow} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
      <TextareaField id="ap-intro" label="Introduction" value={section.intro} onChange={(intro) => onChange({ ...section, intro })} />
      <NumberedListEditor id="ap-stages" label="Stages" items={section.stages} onChange={(stages) => onChange({ ...section, stages })} />
    </>
  );
}

function AboutFields({
  section,
  onChange,
  csrfToken,
}: {
  section: AboutSection;
  onChange: (section: AboutSection) => void;
  csrfToken: string;
}) {
  return (
    <>
      <TextField id="about-eyebrow" label="Eyebrow" value={section.eyebrow} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
      <TextField id="about-heading" label="Heading" value={section.heading} onChange={(heading) => onChange({ ...section, heading })} />
      <ParagraphsField id="about-copy" label="Paragraphs" value={section.paragraphs} onChange={(paragraphs) => onChange({ ...section, paragraphs })} />
      <TextField id="about-portrait-label" label="Portrait label" value={section.portraitLabel} onChange={(portraitLabel) => onChange({ ...section, portraitLabel })} />
      <TextField id="about-portrait-caption" label="Portrait caption" value={section.portraitCaption} onChange={(portraitCaption) => onChange({ ...section, portraitCaption })} />
      <ImageField
        id="about-portrait"
        label="Portrait image"
        value={section.portraitSrc}
        altValue={section.portraitAlt}
        altLabel="Portrait alternative text"
        onChange={(portraitSrc) => onChange({ ...section, portraitSrc })}
        onAltChange={(portraitAlt) => onChange({ ...section, portraitAlt })}
        csrfToken={csrfToken}
      />
    </>
  );
}

function ClosingFields({
  section,
  onChange,
  csrfToken,
}: {
  section: ClosingSection;
  onChange: (section: ClosingSection) => void;
  csrfToken: string;
}) {
  const contact = section.contact;
  return (
    <>
      <TextField id="close-heading" label="Heading" value={section.heading} onChange={(heading) => onChange({ ...section, heading })} />
      <TextareaField id="close-supporting" label="Supporting copy" value={section.supporting} onChange={(supporting) => onChange({ ...section, supporting })} />
      <TextField id="close-email-lead" label="Email lead-in" value={section.emailLead} onChange={(emailLead) => onChange({ ...section, emailLead })} />
      <LinkPair id="close-cta" label="CTA" value={section.cta} onChange={(cta) => onChange({ ...section, cta })} />
      <ImageField
        id="close-bg"
        label="Background image"
        value={section.backgroundImage}
        onChange={(backgroundImage) => onChange({ ...section, backgroundImage })}
        csrfToken={csrfToken}
      />
      <TextField id="form-heading" label="Form heading" value={contact.heading} onChange={(heading) => onChange({ ...section, contact: { ...contact, heading } })} />
      <TextareaField id="form-supporting" label="Form supporting copy" value={contact.supporting} onChange={(supporting) => onChange({ ...section, contact: { ...contact, supporting } })} />
      <TextField id="field-name" label="Name field label" value={contact.fields.name} onChange={(name) => onChange({ ...section, contact: { ...contact, fields: { ...contact.fields, name } } })} />
      <TextField id="field-email" label="Email field label" value={contact.fields.email} onChange={(email) => onChange({ ...section, contact: { ...contact, fields: { ...contact.fields, email } } })} />
      <TextField id="field-org" label="Organisation field label" value={contact.fields.organisation} onChange={(organisation) => onChange({ ...section, contact: { ...contact, fields: { ...contact.fields, organisation } } })} />
      <TextField id="field-message" label="Message field label" value={contact.fields.message} onChange={(message) => onChange({ ...section, contact: { ...contact, fields: { ...contact.fields, message } } })} />
      <TextField id="form-submit" label="Submit label" value={contact.submit} onChange={(submit) => onChange({ ...section, contact: { ...contact, submit } })} />
      <TextField id="form-sending" label="Sending label" value={contact.sending} onChange={(sending) => onChange({ ...section, contact: { ...contact, sending } })} />
      <TextareaField id="form-success" label="Success message" value={contact.success} onChange={(success) => onChange({ ...section, contact: { ...contact, success } })} />
      <TextareaField id="form-error" label="Error message" value={contact.error} onChange={(error) => onChange({ ...section, contact: { ...contact, error } })} />
    </>
  );
}

function RichTextFields({
  section,
  onChange,
}: {
  section: RichTextSection;
  onChange: (section: RichTextSection) => void;
}) {
  return (
    <>
      <TextField id="rt-eyebrow" label="Eyebrow" value={section.eyebrow} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
      <TextField id="rt-heading" label="Heading" value={section.heading} onChange={(heading) => onChange({ ...section, heading })} />
      <ParagraphsField id="rt-copy" label="Paragraphs" value={section.paragraphs} onChange={(paragraphs) => onChange({ ...section, paragraphs })} />
      <div className="grid gap-2">
        <Label htmlFor="rt-tone">Tone</Label>
        <select
          id="rt-tone"
          value={section.tone}
          onChange={(event) =>
            onChange({ ...section, tone: event.target.value as RichTextSection["tone"] })
          }
          className="h-11 rounded-[13px] border border-input bg-white px-3 text-sm"
        >
          <option value="light">Light</option>
          <option value="surface">Surface</option>
          <option value="ink">Ink</option>
        </select>
      </div>
    </>
  );
}

function MediaFields({
  section,
  onChange,
  csrfToken,
}: {
  section: MediaSection;
  onChange: (section: MediaSection) => void;
  csrfToken: string;
}) {
  return (
    <>
      <TextField id="media-eyebrow" label="Eyebrow" value={section.eyebrow} onChange={(eyebrow) => onChange({ ...section, eyebrow })} />
      <TextField id="media-heading" label="Heading" value={section.heading} onChange={(heading) => onChange({ ...section, heading })} />
      <TextareaField id="media-caption" label="Caption" value={section.caption} onChange={(caption) => onChange({ ...section, caption })} />
      <div className="grid gap-2">
        <Label htmlFor="media-layout">Layout</Label>
        <select
          id="media-layout"
          value={section.layout}
          onChange={(event) =>
            onChange({ ...section, layout: event.target.value as MediaSection["layout"] })
          }
          className="h-11 rounded-[13px] border border-input bg-white px-3 text-sm"
        >
          <option value="full">Full width</option>
          <option value="split">Split with caption</option>
        </select>
      </div>
      <ImageField
        id="media-image"
        label="Image"
        value={section.imageSrc}
        altValue={section.imageAlt}
        altLabel="Alternative text"
        onChange={(imageSrc) => onChange({ ...section, imageSrc })}
        onAltChange={(imageAlt) => onChange({ ...section, imageAlt })}
        csrfToken={csrfToken}
      />
    </>
  );
}

export const AdminFields = {
  Text: TextField,
  Textarea: TextareaField,
  Paragraphs: ParagraphsField,
  Image: ImageField,
  Section: SectionEditor,
};
