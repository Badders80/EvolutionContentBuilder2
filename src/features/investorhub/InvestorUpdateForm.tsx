import { useState } from "react";
import horseProfiles from "../../data/horseProfiles.json";
import trainerProfiles from "../../data/trainerProfiles.json";
import type { ContentType, HorseProfile, TrainerProfile, ContentDocument } from "../../types/content";
import { checkContentGuardrails } from "../../lib/guardrails";

const CONTENT_TYPES: ContentType[] = [
  "race_preview",
  "post_race",
  "investor_report",
  "trainer_update"
];

const initialDoc: ContentDocument = {
  id: "",
  content_type: "race_preview",
  horse_name: "",
  date: "",
  headline: "",
  body_intro: "",
  body_details: ""
};

export default function InvestorUpdateForm() {
  const [doc, setDoc] = useState<ContentDocument>(initialDoc);
  const [selectedHorse, setSelectedHorse] = useState<string>("");
  const [customHorse, setCustomHorse] = useState<string>("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [errorTerms, setErrorTerms] = useState<string[]>([]);

  // Load horse profile
  const handleHorseSelect = (id: string) => {
    setSelectedHorse(id);
    if (id === "custom") {
      setDoc({ ...doc, horse_id: undefined, horse_name: customHorse });
      return;
    }
    const horse = (horseProfiles as HorseProfile[]).find(h => h.horse_id === id);
    if (horse) {
      setDoc({
        ...doc,
        horse_id: horse.horse_id,
        horse_name: horse.horse_name,
        trainer_id: horse.trainer_id,
        race_urls: [horse.mistable_url, horse.loveracing_url, horse.stable_profile_url].filter((url): url is string => typeof url === "string" && url.length > 0)
      });
      // Optionally auto-load trainer
      if (horse.trainer_id) {
        const trainer = (trainerProfiles as TrainerProfile[]).find(t => t.trainer_id === horse.trainer_id);
        if (trainer) {
          setDoc(prev => ({ ...prev, trainer_name: trainer.trainer_name, trainer_id: trainer.trainer_id }));
        }
      }
    }
  };

  // Form field handlers
  const handleChange = (field: keyof ContentDocument, value: string) => {
    setDoc({ ...doc, [field]: value });
  };

  // Highlights
  const addHighlight = () => {
    setHighlights([...highlights, ""]);
  };
  const updateHighlight = (idx: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[idx] = value;
    setHighlights(newHighlights);
    setDoc({ ...doc, body_highlights: newHighlights });
  };
  const removeHighlight = (idx: number) => {
    const newHighlights = highlights.filter((_, i) => i !== idx);
    setHighlights(newHighlights);
    setDoc({ ...doc, body_highlights: newHighlights });
  };

  // Guardrails
  const handleSave = () => {
    const banned = checkContentGuardrails(doc);
    setErrorTerms(banned);
    if (banned.length === 0) {
      alert("Content saved!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Form */}
      <form className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white rounded shadow">
        <div className="col-span-2 flex gap-2 mb-2">
          {CONTENT_TYPES.map(type => (
            <button
              key={type}
              type="button"
              className={`px-3 py-1 rounded border ${doc.content_type === type ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-300"}`}
              onClick={() => handleChange("content_type", type)}
            >
              {type.replace(/_/g, " ")}
            </button>
          ))}
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Horse</label>
          <select
            className="w-full border rounded p-2"
            value={selectedHorse}
            onChange={e => handleHorseSelect(e.target.value)}
          >
            <option value="">Select horse...</option>
            {(horseProfiles as HorseProfile[]).map(h => (
              <option key={h.horse_id} value={h.horse_id}>{h.horse_name}</option>
            ))}
            <option value="custom">Custom horse</option>
          </select>
          {selectedHorse === "custom" && (
            <input
              className="mt-2 w-full border rounded p-2"
              placeholder="Enter horse name"
              value={customHorse}
              onChange={e => { setCustomHorse(e.target.value); setDoc({ ...doc, horse_name: e.target.value }); }}
            />
          )}
        </div>
        <div>
          <label className="block font-semibold mb-1">Race Name</label>
          <input className="w-full border rounded p-2" value={doc.race_name ?? ""} onChange={e => handleChange("race_name", e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input type="date" className="w-full border rounded p-2" value={doc.date} onChange={e => handleChange("date", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Headline</label>
          <input className="w-full border rounded p-2" value={doc.headline} onChange={e => handleChange("headline", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Subheading</label>
          <textarea className="w-full border rounded p-2" value={doc.subheading ?? ""} onChange={e => handleChange("subheading", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Intro</label>
          <textarea className="w-full border rounded p-2" value={doc.body_intro} onChange={e => handleChange("body_intro", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Details</label>
          <textarea className="w-full border rounded p-2" value={doc.body_details} onChange={e => handleChange("body_details", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Highlights</label>
          <div className="space-y-2">
            {highlights.map((h, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input className="flex-1 border rounded p-2" value={h} onChange={e => updateHighlight(idx, e.target.value)} />
                <button type="button" className="text-red-500" onClick={() => removeHighlight(idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="mt-2 px-2 py-1 bg-green-100 rounded" onClick={addHighlight}>Add highlight</button>
          </div>
        </div>
        <div className="col-span-2 mt-4">
          <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>Save</button>
        </div>
        {errorTerms.length > 0 && (
          <div className="col-span-2 mt-2 text-red-600">
            <strong>Please remove:</strong> {errorTerms.join(", ")}
          </div>
        )}
      </form>
      {/* Live Preview */}
      <div className="flex-1 p-6 bg-gray-50 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Live Preview</h2>
        <div className="mb-2 text-xl font-semibold">{doc.horse_name}</div>
        <div className="mb-1 text-gray-600">{doc.race_name} &bull; {doc.date}</div>
        <h1 className="text-2xl font-bold mt-4 mb-2">{doc.headline}</h1>
        {doc.subheading && <div className="mb-2 text-gray-500 italic">{doc.subheading}</div>}
        <p className="mb-2">{doc.body_intro}</p>
        <p className="mb-2">{doc.body_details}</p>
        {doc.body_highlights && doc.body_highlights.length > 0 && (
          <ul className="list-disc pl-6 mt-2">
            {doc.body_highlights.map((h, idx) => <li key={idx}>{h}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
