import { useState } from "react";
import { Button, Field, controlClass } from "../../components/ui";
import { useApp } from "../../context/AppState";
import { CITIES, GERMAN_LEVELS, OCCUPATIONS } from "../../lib/constants";
import { useTitle } from "../../lib/useTitle";

export default function Profile() {
  const { user, saveProfile, notify } = useApp();
  const [values, setValues] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city || "Berlin",
    occupation: user.occupation || "student",
    institution: user.institution || "",
    budget: user.budget || "",
    germanLevel: user.germanLevel || "",
    currentPassword: "",
    nextPassword: "",
  });
  const [error, setError] = useState("");
  useTitle("Profile");

  function set(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    const result = saveProfile(values);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    set("currentPassword", "");
    set("nextPassword", "");
    notify("Profile saved.");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4" noValidate>
      <h1 className="font-serif text-4xl">Profile</h1>
      <Field label="Name">
        <input className={controlClass} value={values.name} onChange={(event) => set("name", event.target.value)} />
      </Field>
      <Field label="Email">
        <input className={controlClass} type="email" value={values.email} onChange={(event) => set("email", event.target.value)} />
      </Field>
      <Field label="Phone">
        <input className={controlClass} value={values.phone} onChange={(event) => set("phone", event.target.value)} />
      </Field>
      <Field label="City">
        <select className={controlClass} value={values.city} onChange={(event) => set("city", event.target.value)}>
          {CITIES.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </Field>
      <Field label="I am">
        <select className={controlClass} value={values.occupation} onChange={(event) => set("occupation", event.target.value)}>
          {OCCUPATIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="University or workplace">
        <input className={controlClass} value={values.institution} onChange={(event) => set("institution", event.target.value)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Budget, warm">
          <input className={controlClass} type="number" value={values.budget} onChange={(event) => set("budget", event.target.value)} />
        </Field>
        <Field label="German">
          <select className={controlClass} value={values.germanLevel} onChange={(event) => set("germanLevel", event.target.value)}>
            {GERMAN_LEVELS.map((level) => (
              <option key={level || "none"} value={level}>
                {level || "Not specified"}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Current password" hint="Only needed if you want a new password.">
        <input className={controlClass} type="password" value={values.currentPassword} onChange={(event) => set("currentPassword", event.target.value)} />
      </Field>
      <Field label="New password">
        <input className={controlClass} type="password" value={values.nextPassword} onChange={(event) => set("nextPassword", event.target.value)} />
      </Field>
      {error ? <p className="text-sm text-copper">{error}</p> : null}
      <Button type="submit">Save profile</Button>
    </form>
  );
}
