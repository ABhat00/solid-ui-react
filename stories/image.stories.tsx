/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { ReactElement } from "react";
import * as SolidFns from "@inrupt/solid-client";
import { withKnobs, boolean, number, text } from "@storybook/addon-knobs";
import Image from "../src/components/image";
import CombinedDataProvider from "../src/context/combinedDataContext";
import config from "./config";

const { host } = config();

export default {
  title: "Components/Image",
  component: Image,
  decorators: [withKnobs],
};

export function WithDatasetProvider(): ReactElement {
  return (
    <CombinedDataProvider
      datasetUrl={text("Dataset Url", `${host}/example.ttl`)}
      thingUrl={text("Thing Url", `${host}/example.ttl#exampleImage`)}
    >
      <Image property="http://schema.org/contentUrl" />
    </CombinedDataProvider>
  );
}

export function EditFalse(): ReactElement {
  const exampleUrl = `${host}/example.jpg`;
  const exampleProperty = `http://www.w3.org/2006/vcard/ns#hasPhoto`;
  const exampleThing = SolidFns.addUrl(
    SolidFns.createThing(),
    exampleProperty,
    exampleUrl
  );
  return <Image thing={exampleThing} property={exampleProperty} />;
}

export function EditTrue(): ReactElement {
  const exampleUrl = `${host}/example.jpg`;
  const exampleProperty = `http://www.w3.org/2006/vcard/ns#hasPhoto`;
  const exampleThing = SolidFns.addUrl(
    SolidFns.createThing(),
    exampleProperty,
    exampleUrl
  );
  return (
    <Image
      thing={exampleThing}
      property={exampleProperty}
      edit={boolean("Edit", true)}
      autosave={boolean("Autosave", true)}
      maxSize={number("Max Size", 100)}
    />
  );
}
