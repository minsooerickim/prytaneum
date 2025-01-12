/**
 * @generated SignedSource<<e19ff0d8e6561096bfdad90154c597b1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SpeakerListFragment$data = {
  readonly speakers: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly pictureUrl: string | null;
        readonly name: string | null;
        readonly description: string | null;
        readonly title: string | null;
      };
      readonly cursor: string;
    }> | null;
  } | null;
  readonly " $fragmentType": "SpeakerListFragment";
};
export type SpeakerListFragment = SpeakerListFragment$data;
export type SpeakerListFragment$key = {
  readonly " $data"?: SpeakerListFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"SpeakerListFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SpeakerListFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "EventSpeakerConnection",
      "kind": "LinkedField",
      "name": "speakers",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "EventSpeakerEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "EventSpeaker",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "pictureUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "description",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "title",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Event",
  "abstractKey": null
};

(node as any).hash = "1263a427258bbec279bc6a96f8d2c1ba";

export default node;
