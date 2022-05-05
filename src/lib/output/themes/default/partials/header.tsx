import type { Reflection } from "../../../../models";
import { JSX } from "../../../../utils";
import type { PageEvent } from "../../../events";
import { hasTypeParameters, join, renderFlags } from "../../lib";
import type { DefaultThemeRenderContext } from "../DefaultThemeRenderContext";

export function header(context: DefaultThemeRenderContext, props: PageEvent<Reflection>) {
    return (
        <header>
            {!context.options.getValue("hideGoJSNav") && (
                <nav id="navTop" class="w-full z-30 top-0 text-white bg-nwoods-primary">
                    <div class="w-full container max-w-screen-lg mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between mt-0 py-2">
                        <div class="md:pl-4">
                            <a class="text-white hover:text-white no-underline hover:no-underline
                            font-bold text-2xl lg:text-4xl rounded-lg hover:bg-nwoods-secondary" href={context.relativeURL("../index.html")}>
                            <h1 class="mb-0 p-1 leading-none">GoJS</h1>
                            </a>
                        </div>
                        <button id="topnavButton" class="rounded-lg sm:hidden focus:outline-none focus:ring" aria-label="Navigation">
                            <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
                            <path id="topnavOpen" fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                            <path id="topnavClosed" class="hidden" fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                        <div id="topnavList" class="hidden sm:block items-center w-auto mt-0 text-white p-0 z-20">
                            <ul class="list-reset list-none font-semibold flex justify-end flex-wrap sm:flex-nowrap items-center px-0 pb-0">
                                <li class="p-1 sm:p-0"><a class="topnav-link" href={context.relativeURL("../learn/index.html")}>Learn</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href={context.relativeURL("../samples/index.html")}>Samples</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href={context.relativeURL("../intro/index.html")}>Intro</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href={context.relativeURL("../api/index.html")}>API</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href="https://www.nwoods.com/products/register.html">Register</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href={context.relativeURL("../download.html")}>Download</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href="https://forum.nwoods.com/c/gojs/11">Forum</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href="https://www.nwoods.com/contact.html"
                                    target="_blank" rel="noopener" id="contactBtn">Contact</a></li>
                                <li class="p-1 sm:p-0"><a class="topnav-link" href="https://www.nwoods.com/sales/index.html"
                                    target="_blank"rel="noopener" id="buyBtn">Buy</a></li>
                            </ul>
                        </div>
                    </div>
                    <hr class="border-b border-gray-600 opacity-50 my-0 py-0" />
                </nav>
            )}
            <div class="tsd-page-header">
                <div class="tsd-page-toolbar">
                    <div class="w-full max-w-screen-xl mx-auto px-2">
                        <div class="table-wrap">
                            <div class="table-cell" id="tsd-search" data-base={context.relativeURL("./")}>
                                <div class="field">
                                    <label for="tsd-search-field" class="tsd-widget search no-caption">
                                        Search
                                    </label>
                                    <input type="text" id="tsd-search-field" />
                                </div>

                                <ul class="results">
                                    <li class="state loading">Preparing search index...</li>
                                    <li class="state failure">The search index is not available</li>
                                </ul>

                                <a href={context.relativeURL("index.html")} class="title">
                                    {props.project.name}
                                </a>
                            </div>

                            <div class="table-cell" id="tsd-widgets">
                                <div id="tsd-filter">
                                    <a href="#" class="tsd-widget options no-caption" data-toggle="options">
                                        Options
                                    </a>
                                    <div class="tsd-filter-group">
                                        <div class="tsd-select" id="tsd-filter-visibility">
                                            <span class="tsd-select-label">All</span>
                                            <ul class="tsd-select-list">
                                                <li data-value="public">Public</li>
                                                <li data-value="protected">Public/Protected</li>
                                                <li data-value="private" class="selected">
                                                    All
                                                </li>
                                            </ul>
                                        </div>{" "}
                                        {!context.options.getValue("excludeInherited") && (
                                            <>
                                                <input type="checkbox" id="tsd-filter-inherited" checked={context.options.getValue("showInheritedDefault")} />
                                                <label class="tsd-widget" for="tsd-filter-inherited">
                                                    Inherited
                                                </label>
                                            </>
                                        )}
                                        {!context.options.getValue("excludeExternals") && (
                                            <>
                                                <input type="checkbox" id="tsd-filter-externals" checked={true} />
                                                <label class="tsd-widget" for="tsd-filter-externals">
                                                    Externals
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <a href="#" class="tsd-widget menu no-caption" data-toggle="menu">
                                    Menu
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tsd-page-title">
                <div class="w-full max-w-screen-xl mx-auto px-2">
                    <div class="top-copyright">
                        <JSX.Raw html={context.options.getValue("topCopyright")} />
                        <JSX.Raw html={context.getVersion()} /><br/>
                        by <a href="https://www.nwoods.com/">Northwoods Software&reg;</a>
                    </div>
                    <div>
                        <h1>
                            {props.model.kindString !== "Project" && `${props.model.kindString ?? ""} `}
                            {props.model.name}
                            {hasTypeParameters(props.model) && (
                                <>
                                    {"<"}
                                    {join(", ", props.model.typeParameters, (item) => item.name)}
                                    {">"}
                                </>
                            )}{" "}
                            {renderFlags(props.model.flags)}
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
}
