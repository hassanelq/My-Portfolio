"use client";

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
require("dotenv").config();

export default function ContactPage() {
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
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: "Hassan",
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
    <div className="w-screen pt-[15vh]">
      <form
        className="flex h-auto flex-col gap-4 w-[90vw] max-w-[600px] mx-auto p-4 sm:w-[80vw] md:w-[60vw] lg:w-[50vw]"
        onSubmit={handleSubmit}
      >
        <div className="text-center text-[2.5rem] sm:text-[2.7rem] md:text-[3rem] font-semibold text-[#d4d4d4]">
          <span className="font-light opacity-50">Get</span> in Touch.
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="name"
            className="font-light text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600"
          >
            Your Name
          </label>
          <input
            value={inputFields.name}
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            className="py-2 px-4 flex-shrink-0 border-b-1 bg-[var(--background,_#303030)] focus:border-white focus:border-b-2 focus:outline-none rounded-[10px]"
          />
          {errors.name && (
            <span className="text-sm text-gray-400">{errors.name}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="font-light text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600"
          >
            Your Email
          </label>
          <input
            value={inputFields.email}
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            className="py-2 px-4 flex-shrink-0 border-b-1 bg-[var(--background,_#303030)] focus:border-white focus:border-b-2 focus:outline-none rounded-[10px]"
          />
          {errors.email && (
            <span className="text-sm text-gray-400">{errors.email}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="text"
            className="font-light text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600"
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
            className="py-2 px-4 flex-shrink-0 border-b-1 bg-[var(--background,_#303030)] resize-none focus:border-white focus:border-b-2 focus:outline-none rounded-[10px]"
          />

          {errors.text && (
            <span className="text-sm text-gray-400">{errors.text}</span>
          )}
        </div>

        <button
          className="relative w-fit flex justify-center items-center m-auto mt-3 px-5 py-3 text-center text-lg sm:text-xl leading-5 font-medium text-[#d4d4d4] box-border shadow-[0px_1px_1px_rgba(0,0,0,0.04),0px_2px_3px_rgba(0,0,0,0.12),0px_6px_9px_rgba(0,0,0,0.6)] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0)] bg-[rgba(0,0,0,0.1)] border border-[rgba(255,255,255,0.1)] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[rgba(255,255,255,0.08)]"
          type="submit"
        >
          Send Message
        </button>

        {Object.keys(errors).length === 0 && submitting && (
          <span className="text-lg text-center font-light bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
            Thank you for your message!
          </span>
        )}
      </form>
    </div>
  );
}
