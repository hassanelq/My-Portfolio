"use client";

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [inputFields, setInputFields] = useState({
    name: "",
    email: "",
    text: "",
  });
  const { name, email, text } = inputFields;
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateValues = (inputValues) => {
    let errors = {};

    if (!inputValues.name) {
      errors.name = "Name is Required!";
    } else if (inputValues.name.length > 30) {
      errors.name = "Name too long!";
    }

    if (!inputValues.email) {
      errors.email = "Email is Required!";
    } else if (!/\S+@\S+\.\S+/.test(inputValues.email)) {
      errors.email = "Invalid email address";
    }

    if (!inputValues.text) {
      errors.text = "Please enter your message";
    }

    return errors;
  };

  const handleChange = (e) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validateValues(inputFields));
    setSubmitting(true);
  };

  const finishSubmit = () => {
    const serviceId = "service_9ao0c7q";
    const templateId = "template_424gvax";
    const publicKey = "WHXSC293BF4cSeWRf";

    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: "ADE",
      message: text,
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully!", response);
        setInputFields({ name: "", email: "", text: "" });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && submitting) {
      finishSubmit();
    }
  }, [errors]);

  return (
    <form
      className="flex flex-col gap-4 w-[50vw] max-w-[65vw] mx-auto p-4"
      onSubmit={handleSubmit}
    >
      <div className="text-center text-[3.8rem] font-semibold text-[#d4d4d4]">
        <span className="font-light opacity-50">Get</span> in Touch.
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="font-light text-[1.3rem] bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600"
        >
          Your Name
        </label>
        <input
          value={inputFields.name}
          onChange={handleChange}
          type="text"
          name="name"
          id="name"
          className="p-2.5 flex-shrink-0 border-b-1 bg-[var(--background,_#303030)]"
        />
        {errors.name && (
          <span className="text-sm text-gray-400">{errors.name}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="email"
          className="font-light text-[1.3rem] bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600"
        >
          Your Email
        </label>
        <input
          value={inputFields.email}
          onChange={handleChange}
          type="email"
          name="email"
          id="email"
          className="p-2.5 flex-shrink-0 border-b-1 bg-[var(--background,_#303030)]"
        />
        {errors.email && (
          <span className="text-sm text-gray-400">{errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="text"
          className="font-light text-[1.3rem] bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600"
        >
          Your Text
        </label>
        <textarea
          value={inputFields.text}
          onChange={handleChange}
          name="text"
          id="text"
          cols="40"
          rows="5"
          className="p-2.5 flex-shrink-0 border-b-1 bg-[var(--background,_#303030)] resize-none"
        />
        {errors.text && (
          <span className="text-sm text-gray-400">{errors.text}</span>
        )}
      </div>

      <button
        className="relative w-fit flex justify-center items-center m-auto px-5 py-3 text-center text-[18px] leading-5 font-medium text-[#d4d4d4] box-border shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)]"
        type="submit"
      >
        Send Message
      </button>
      {Object.keys(errors).length === 0 && submitting && (
        <span className="text-lg font-light bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
          Thank you for your message!
        </span>
      )}
    </form>
  );
}