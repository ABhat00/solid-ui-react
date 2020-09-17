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

import React, { ReactElement, useContext, useState, useEffect } from "react";
import * as SolidFns from "@inrupt/solid-client";
import { DatasetProvider } from "../src/context/datasetContext";
import ThingContext, { ThingProvider } from "../src/context/thingContext";
import config from "./config";

const { host } = config();

export default {
  title: "Providers/Thing Provider",
  component: ThingProvider,
};

export function WithLocalThing(): ReactElement {
  const property = "http://xmlns.com/foaf/0.1/name";
  const name = "example value";

  const exampleThing = SolidFns.addStringNoLocale(
    SolidFns.createThing(),
    property,
    name
  );

  return (
    <ThingProvider thing={exampleThing}>
      <ExampleComponentWithThing />
    </ThingProvider>
  );
}

interface IWithThingUrl {
  datasetUrl: string;
  thingUrl: string;
  property: string;
}

export function WithThingUrl(props: IWithThingUrl): ReactElement {
  const { datasetUrl, thingUrl, property } = props;
  const [litDataset, setLitDataset] = useState<
    SolidFns.LitDataset & SolidFns.WithResourceInfo
  >();

  const setDataset = async (url: string) => {
    await SolidFns.fetchLitDataset(url).then((result) => {
      setLitDataset(result);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line no-void
    void setDataset(datasetUrl);
  }, [datasetUrl]);

  if (litDataset) {
    return (
      <DatasetProvider dataset={litDataset}>
        <ThingProvider thingUrl={thingUrl}>
          <ExampleComponentWithThingUrl property={property} />
        </ThingProvider>
      </DatasetProvider>
    );
  }
  return <span>no dataset</span>;
}

WithThingUrl.args = {
  datasetUrl: `${host}/example.ttl`,
  thingUrl: `${host}/example.ttl#me`,
  property: "http://www.w3.org/2006/vcard/ns#note",
};

interface IExampleComponentWithThingUrl {
  property?: string;
}

function ExampleComponentWithThingUrl(
  props: IExampleComponentWithThingUrl
): ReactElement {
  const { property: propertyUrl } = props;

  const [property, setProperty] = useState<string>("fetching in progress");

  const thingContext = useContext(ThingContext);
  const { thing } = thingContext;

  useEffect(() => {
    if (thing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
        thing,
        propertyUrl as string
      );

      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [propertyUrl, thing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}

ExampleComponentWithThingUrl.defaultProps = {
  property: "http://www.w3.org/2006/vcard/ns#note",
};

function ExampleComponentWithThing(): ReactElement {
  const [property, setProperty] = useState<string>("fetching in progress");
  const thingContext = useContext(ThingContext);
  const { thing } = thingContext;

  useEffect(() => {
    if (thing) {
      const fetchedProperty = SolidFns.getStringUnlocalizedOne(
        thing,
        "http://xmlns.com/foaf/0.1/name"
      );
      if (fetchedProperty) {
        setProperty(fetchedProperty);
      }
    }
  }, [thing]);

  return (
    <div>
      <h2>{property}</h2>
    </div>
  );
}
