/// <reference path="../ez.ts"/>

interface PostPreviewModel {
  id: string,
  title: string,
  type: string,
  date: string,
  cover: string,
  tags: Array<string>
}

module ez {
  class PostPreview {
    constructor(private _element: EzPostPreviewElement) { }

    private _template = Handlebars.templates['ez-post-preview'];

    private _$anchor: JQuery;
    private _$container: JQuery;
    private _$cover: JQuery;
    private _$date: JQuery;
    private _$header: JQuery
    private _$title: JQuery;

    private _entrance: any;

    createdCallback() {
      if (!this._element)
        PostPreview.call(this, this)

      this._element.innerHTML = '';
      this._element.appendChild(
        ez.createDocumentFragment(this._template({})));

      this._$anchor = getChild(this._element, '[name=anchor]');
      this._$container = getChild(this._element, '[name=container]');
      this._$cover = getChild(this._element, '[name=cover]');
      this._$date = getChild(this._element, '[name=date]');
      this._$header = getChild(this._element, '[name=header]');
      this._$title = getChild(this._element, '[name=title]');
    }

    // todo:
    // try to shrink image to a reasonable size, then let css position
    attachedCallback() {
      this._$container.on('mouseenter', () => {
        this._$cover.velocity({ opacity: 0.5 }, 300);
        this._$header.velocity('fadeIn', 300);
      });
      this._$container.on('mouseleave', () => {
        this._$cover.velocity({ opacity: 1 }, 300);
        this._$header.velocity('fadeOut', 300);
      });
    }

    get id(): string {
      return this._element.getAttribute('id');
    }

    get tags(): Array<string> {
      return this._element.getAttribute('tags').split(' ');
    }

    get type(): string {
      return this._element.getAttribute('data-type');
    }

    public load(model: PostPreviewModel): void {
      this._element.setAttribute('id', model.id);
      this._element.setAttribute('tags', model.tags.join(' '));
      this._$anchor.attr('href', '/p/' + model.id);
      this._$title.text(model.title);
      this._$date.text(model.date);
      this._$cover.attr('src', model.cover);
      this._element.setAttribute('data-type', model.type);

      this._$cover.on('load', () => {
        this._resize();
      });
    }

    private _resize() {
      var height_ratio = this._$cover.height() / this._$container.height();
      var width_ratio = this._$cover.width() / this._$container.width();

      if (height_ratio > width_ratio && width_ratio > 1)
        this._$cover.width(this._$container.width());
      else if (width_ratio > height_ratio && height_ratio > 1)
        this._$cover.height(this._$container.height());
    }
  }

  export interface EzPostPreviewElement extends HTMLElement {
    id: string;
    tags: string;
    type: string;
    load(model: PostPreviewModel): void;
  }

  if (!ez.registered('ez-post-preview'))
    export var EzPostPreviewElement = ez.registerElement(
      'ez-post-preview', HTMLElement, PostPreview);
}
