/**
 * @generated SignedSource<<d7e31e8658197b9083bdcd4751f55e55>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";

import {  } from "relay-runtime";
export type LiveFeedbackAuthorFragment = {
    readonly createdBy: {
        readonly id: string;
        readonly firstName: string | null;
        readonly lastName: string | null;
        readonly avatar: string | null;
    } | null;
    readonly createdAt: Date | null;
    readonly " $refType": "LiveFeedbackAuthorFragment";
};
export type LiveFeedbackAuthorFragment = LiveFeedbackAuthorFragment$data;
export type LiveFeedbackAuthorFragment$key = {
  readonly " $data"?: LiveFeedbackAuthorFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"LiveFeedbackAuthorFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LiveFeedbackAuthorFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "createdBy",
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
          "name": "firstName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lastName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "avatar",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    }
  ],
  "type": "EventLiveFeedback",
  "abstractKey": null
};
(node as any).hash = 'a0a13d002b29cf7f098fd4cd05756b36';
export default node;
