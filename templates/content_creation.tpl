<div id="articoolo_main_form_container">
    <input type="hidden" id="articoolo_payment_link" value="{payment_link}" />
    <div class="articoolo_balance">Balance: <span id="articoolo_user_balance">{user_balance} </span><br /><br /><button id="articoolo_payment_button" class="articoolo_button">Buy credits</button></div>
    <div class="articoolo_logo"></div>
    <div class="articoolo_title_container">
        <div id="articoolo_service_title" class="articoolo_title">
            <span id="articoolo_main_title">Create unique textual content in a flash</span>
            <div class="articoolo_subtitle_small"><strong>A quick, coherent starting point for your articles</strong></div>
        </div>
        <div class="articoolo_radio_container">

            <div class="articoolo_radio_block">
                <input type="radio" id="create" value="create" name="radio-article" checked>
                <label for="create"></label>

                <span>create article</span>
            </div>

            <div class="articoolo_radio_block">
                <input type="radio" id="rewrite" value="rewrite"  name="radio-article">
                <label for="rewrite"></label>
                <span>rewrite article</span>
            </div>

            <div class="articoolo_article-write-container create-article-form">
                <div class="articoolo_article-write-area articoolo_article-first">
                        <input type="text" class="articoolo_article-write" id="articoolo_article-write" name="article_keywords" placeholder="Write me an article about... (describe it in 2-5 words)" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Write me an article about... (describe it in 2-5 words)'" value="">
                        <button id="articoolo_create_hidden_button" class="articoolo_article-write-button"></button>
                        <button id="articoolo_create_article_button" class="article-edit-button button-create"  disabled="disabled" style="display:none;">Create</button>
                </div>
            </div>
            <div class="articoolo_article-write-container rewrite-article-form" style="display: none;">
                <div class="articoolo_article-write-area">
                    <div class="article-write-content-area-first">
                        <div class="article-write-content-area-second">
                            <textarea id="articoolo_article-rephrase" class="textarea-scrollbar scrollbar-outer" name="rephrase_text" placeholder="Please enter your text here" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Please enter your text here'"></textarea>
                        </div>
                        <div class="article-write-prevention">
                            <span class="article-write-word-limit">Limited to 500 words</span>
                            <span class="article-write-word-count">Word count: <span class="display_count">0</span></span>
                            <span class="article-write-word-warning" style="display: none;"><span class="display_count">0</span> The text you entered is too long</span>
                        </div>
                    </div>
                    <div class="article-write-button-container">
                        <button id="articoolo_rephrase_button" class="article-write-button">Rewrite</button>
                    </div>
                </div>
            </div>
            <hr class="hr-create-article" color="#b7e8f6" size="1">

            <div id="hidden-write" style="display: block; opacity: 1;">
                <div class="suggestions-loader">
                    <img src="{plugin_path}/img/loading.gif"/>
                </div>

                <div class="article_generation_error">
                    <span> </span>
                </div>

                <div id="suggestions-block" class="article-write-area-other" style="display: none">
                    <div class="article-optional-topics">
                        <h3 id="suggestions_title_block" style="display: block;"><div id="suggestions_title" style="display: inline">OPTIONAL TOPICS</div></h3>
                        <div class="article-optional-topics-var"> <span>+</span><a href="#"></a><br> <span>+</span><a href="#"></a><br> <span>+</span><a href="#"></a><br></div>
                    </div>
                    <div class="article-select-maximum">
                        <h3>Select maximum word count</h3>
                        <input type="text" name="article_length" id="amount" style="border:0; color:#f6931f; font-weight:bold;">
                        <div id="articoolo_slider"></div>
                        <span class="min-value">250</span>
                        <span class="max-value">500</span>
                    </div>
                    <div class="article-select-uniqueness">
                        <div class="select-uniqueness">
                            <h3>Preferences</h3>
                            <p class="readability">better<br>readability</p>
                            <p class="uniqueness">enhanced<br>uniqueness</p>
							<span class="toggle-bg-uniq">
								<input class="toggle-switch" id="toggle-off-uniq" type="radio" name="force_uniqueness" value="on">
								<input class="toggle-switch" id="toggle-on-uniq" type="radio" name="force_uniqueness" value="off" checked>
								<span class="switch-uniq"></span>
								<span class="switch-on-bg-uniq"></span>
								<span class="switch-off-bg-uniq"></span>
							</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="articoolo_articles_filter">
    <div class="articoolo_input_field">
        <input id="articoolo_filter_keyword" type="text" placeholder="Search Article by keyword" value="">
    </div>
    <span>OR BY DATE</span>
    <div class="articoolo_input_field datepicker">
        <input type="text" id="articoolo_date_from" name="date_from"  placeholder="Date From" value="">
    </div>
    <div class="articoolo_input_field datepicker">
        <input type="text" id="articoolo_date_to" name="date_to"  placeholder="Date To" value="">
    </div>
    <button id="articoolo_filter_button" class="button" value=""></button>
</div>

<div class="article_generation_animation">
    <span> Preparing an article, please wait... It may take a few minutes. </span>
</div>
<div id="articoolo_article_view">
    <div style="padding-top: 2%">
        <div class="articoolo_article_list_link_block">
            <button id="articoolo_article_list_link" class="articoolo_button">Back to articles</button>
        </div>
        <div style="float: right; color: black">
            Uniqueness: <b><span id="articoolo_uniqueness_amount"></span>%</b>
        </div>
    </div>
    <div class="articoolo_article_title">
        <h3 id="articoolo_article_title_text"></h3>
    </div>
    <div id="articoolo_article_content"> </div>
</div>

<div class="articoolo_articles_list_block">
    <div class="articoolo_articles_container"> </div>
    <div class="articoolo_show_more_block">
        <button id="articoolo_show_more_button" class="articoolo_button">Show more</button>
    </div>
</div>

<div id="article_list_item_prototype" class="articoolo_articles_block" style="display: none">
    <div name="article_item_title" class="article_title"></div>
    <div name="article_item_date" class="article_date"></div>
    <div name="article_item_words_count" class="words_qty"></span></div>
    <button class="article_view_full" name="article_item_view_link">view</button>
</div>