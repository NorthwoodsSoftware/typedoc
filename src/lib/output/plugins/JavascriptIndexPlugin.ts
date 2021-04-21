import * as Path from "path";
import { Builder, trimmer } from "lunr";

import {
    DeclarationReflection,
    ProjectReflection,
    ReflectionKind,
} from "../../models/reflections/index";
import { Component, RendererComponent } from "../components";
import { writeFile } from "../../utils/fs";
import { RendererEvent } from "../events";

/**
 * A plugin that exports an index of the project to a javascript file.
 *
 * The resulting javascript file can be used to build a simple search function.
 */
@Component({ name: "javascript-index" })
export class JavascriptIndexPlugin extends RendererComponent {
    /**
     * Create a new JavascriptIndexPlugin instance.
     */
    initialize() {
        this.listenTo(this.owner, RendererEvent.BEGIN, this.onRendererBegin);
    }

    /**
     * Triggered after a document has been rendered, just before it is written to disc.
     *
     * @param event  An event object describing the current render operation.
     */
    private onRendererBegin(event: RendererEvent) {
        const rows: any[] = [];

        for (const reflection of event.project.getReflectionsByKind(
            ReflectionKind.All
        )) {
            if (!(reflection instanceof DeclarationReflection)) {
                continue;
            }

            if (
                !reflection.url ||
                !reflection.name ||
                reflection.flags.isExternal ||
                reflection.name === ""
            ) {
                continue;
            }

            let parent = reflection.parent;
            if (parent instanceof ProjectReflection) {
                parent = undefined;
            }

            const row: any = {
                id: rows.length,
                kind: reflection.kind,
                fullName: reflection.name,
                url: reflection.url,
                classes: reflection.cssClasses,
            };

            if (parent) {
                row.parent = parent.getFullName();
                row.fullName = `${row.parent}.${reflection.name}`;
            }

            rows.push(row);
        }

        const builder = new Builder();
        builder.pipeline.add(trimmer);

        builder.ref("id");
        builder.field("fullName");

        rows.forEach((row) => {
            if (!row.parent) {
                builder.add(row, { boost: 100 });  // boost top-level reflections
            } else {
                builder.add(row);
            }
        });

        const index = builder.build();

        const jsonFileName = Path.join(
            event.outputDirectory,
            "assets",
            "js",
            "search.js"
        );
        const jsonData = JSON.stringify({
            rows,
            index,
        });

        writeFile(jsonFileName, `/* Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved. */
        window.searchData = ${jsonData}`, false);
    }
}
