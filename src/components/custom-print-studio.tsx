"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ArrowRight, ImagePlus, Loader2, MessageCircle, Move, RotateCcw, Scissors } from "lucide-react";

type CustomPrintStudioProps = {
  brandName: string;
  pickupArea: string;
  shopHours: string;
};

const shirtColors = [
  { label: "Black", value: "#111111" },
  { label: "White", value: "#f8f7f2" },
  { label: "Navy", value: "#111827" },
  { label: "Grey", value: "#8a8a8a" },
];

export function CustomPrintStudio({
  brandName,
  pickupArea,
  shopHours,
}: CustomPrintStudioProps) {
  const [artwork, setArtwork] = useState("");
  const [artworkName, setArtworkName] = useState("my-custom-print");
  const [shirtColor, setShirtColor] = useState(shirtColors[0].value);
  const [placement, setPlacement] = useState("Front");
  const [size, setSize] = useState(75);
  const [zoom, setZoom] = useState(100);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const colorName = useMemo(() => {
    return shirtColors.find((color) => color.value === shirtColor)?.label ?? "Black";
  }, [shirtColor]);

  const previewSummary = useMemo(() => {
    const colorName = shirtColors.find((color) => color.value === shirtColor)?.label ?? "Black";
    return `${placement}, ${colorName}, ${size}% size, ${zoom}% crop`;
  }, [placement, shirtColor, size, zoom]);

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setArtworkName(baseName || "my-custom-print");

    const reader = new FileReader();
    reader.onload = () => setArtwork(String(reader.result));
    reader.readAsDataURL(file);
  }

  function resetLayout() {
    setSize(75);
    setZoom(100);
    setX(0);
    setY(0);
    setPlacement("Front");
  }

  async function reserveCustomPrint() {
    setSaving(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orderType: "custom",
          customerName,
          customerPhone,
          placement,
          shirtColor: colorName,
          artworkName,
          artworkPreview: artwork,
          printSize: size,
          cropZoom: zoom,
          positionX: x,
          positionY: y,
          notes,
        }),
      });
      if (!response.ok) {
        throw new Error("Could not save custom order.");
      }
      const result = (await response.json()) as { whatsappUrl: string };
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="custom-print" className="custom-studio-section">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="custom-copy">
          <span className="eyebrow">Custom print studio</span>
          <h2>Upload it. Place it. Name it for pickup.</h2>
          <p>
            Customers can preview their artwork on a tee before sending the order to {brandName}.
            The artwork name and layout notes go straight into WhatsApp so the admin can identify it fast.
          </p>

          <div className="custom-steps">
            <div>
              <ImagePlus size={19} />
              <strong>Upload artwork</strong>
              <span>PNG, JPG, logo, quote, or design mockup.</span>
            </div>
            <div>
              <Move size={19} />
              <strong>Position + resize</strong>
              <span>Move the print and adjust its visible crop.</span>
            </div>
            <div>
              <MessageCircle size={19} />
              <strong>Reserve on WhatsApp</strong>
              <span>Send the preview details and attach the image in chat.</span>
            </div>
          </div>
        </div>

        <div className="custom-studio">
          <div className="mockup-panel">
            <div className="mockup-toolbar">
              <span>{placement} preview</span>
              <button type="button" onClick={resetLayout}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            <div className="shirt-board">
              <div className="custom-shirt" style={{ backgroundColor: shirtColor }}>
                <div
                  className="print-window"
                  style={{
                    width: `${size}%`,
                    transform: `translate(calc(-50% + ${x}px), ${y}px)`,
                  }}
                >
                  {artwork ? (
                    <img
                      src={artwork}
                      alt={artworkName}
                      style={{ transform: `scale(${zoom / 100})` }}
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <ImagePlus size={26} />
                      <span>Upload artwork</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="studio-note">
              This preview helps with placement. Pickup is from {pickupArea} during {shopHours}. WhatsApp cannot attach the image automatically, so send the artwork file after opening the chat.
            </p>
          </div>

          <div className="controls-panel">
            <label className="studio-upload">
              <ImagePlus size={18} />
              Upload image
              <input type="file" accept="image/*" onChange={handleUpload} />
            </label>

            <label className="studio-field">
              Rename artwork for admin
              <input
                value={artworkName}
                onChange={(event) => setArtworkName(event.target.value)}
                placeholder="e.g. Jay skull front print"
              />
            </label>

            <div className="studio-grid">
              <label className="studio-field">
                Customer name
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Name for the order"
                />
              </label>
              <label className="studio-field">
                Phone
                <input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="Optional phone number"
                />
              </label>
            </div>

            <div className="studio-grid">
              <label className="studio-field">
                Placement
                <select value={placement} onChange={(event) => setPlacement(event.target.value)}>
                  <option>Front</option>
                  <option>Back</option>
                  <option>Left chest</option>
                </select>
              </label>
              <label className="studio-field">
                T-shirt color
                <select value={shirtColor} onChange={(event) => setShirtColor(event.target.value)}>
                  {shirtColors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Slider label="Print size" value={size} min={40} max={95} suffix="%" onChange={setSize} />
            <Slider label="Crop zoom" value={zoom} min={70} max={180} suffix="%" onChange={setZoom} icon={<Scissors size={16} />} />
            <Slider label="Move left / right" value={x} min={-80} max={80} suffix="px" onChange={setX} />
            <Slider label="Move up / down" value={y} min={-80} max={80} suffix="px" onChange={setY} />

            <label className="studio-field">
              Notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={`Layout: ${previewSummary}`}
              />
            </label>

            <button type="button" onClick={reserveCustomPrint} disabled={saving} className="studio-reserve disabled:opacity-60">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
              Save order and open WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  icon,
  label,
  max,
  min,
  onChange,
  suffix,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  suffix: string;
  value: number;
}) {
  return (
    <label className="studio-slider">
      <span>
        <span className="inline-flex items-center gap-2">
          {icon}
          {label}
        </span>
        <strong>
          {value}
          {suffix}
        </strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
