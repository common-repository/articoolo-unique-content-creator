var articoolo_next_page = 1;
var articoolo_list_on_page = 0;
var articoolo_empty_general_list = 0;

$(document).ready(function() {
    articooloGetArticleList();

    $('#articoolo_article-write').keypress(function (e) {
        if (e.which == 13) {
            var current_form = $('.articoolo_article-write-container').filter(function() {
                return $(this).css("display") !== 'none';
            });

            current_form.find('button[disabled!="disabled"]').trigger('click');
            return false;
        }
    });

    $('#rewrite').click(function() {
        $('#suggestions-block,.article_generation_error').hide();
        $('#articoolo_main_title').text('Rewrite your article in a flash');
        $('div.create-article-form').hide();
        $('div.rewrite-article-form').show();
        //Rephrase word count
        $('#articoolo_article-rephrase').articooloWordCount();
        // Scroll inicialization
        $('.textarea-scrollbar').scrollbar();
    });
    $('#create').click(function() {
        $('#articoolo_main_title').text('Create unique textual content in a flash');
        $('div.rewrite-article-form,.article_generation_error').hide();
        $('div.create-article-form').show();
    });

    // Slider
    $('#articoolo_slider').slider({
        range: "min",
        value: 450,
        min: 250,
        max: 500,
        step: 50,
        slide: function( event, ui ) {
            $('#amount').val( ui.value );
        }
    });

    $('#amount').appendTo(".ui-slider-handle");
    $(".ui-slider-handle").append("<span class='circle'></span>");

    $('#amount').val( $( "#articoolo_slider" ).slider( "value" ) );

    $('.info_link').tooltip({
        show: null,
        position: {
            my: "left top",
            at: "left bottom"
        },
        open: function( event, ui ) {
            ui.tooltip.animate({ top: ui.tooltip.position().top + 10 }, "fast" );
        }
    });

    // Preferences
    $('input#toggle-off-uniq').click( function() {
        $(".readability").css("color", "#a7a9ab");
        $(".uniqueness").css("color", "#14b2ef");
    });

    $("input#toggle-on-uniq").click( function() {
        $(".readability").css("color", "#14b2ef");
        $(".uniqueness").css("color", "#a7a9ab");
    });

    $('.article-optional-topics-var').delegate('a', 'click', function() {
        $('.article-optional-topics-var').find('a').css('color', '#858585');
        $(this).css('color', '#17b4eb');
        $('#articoolo_article-write').val($(this).text());
        $('#articoolo_create_hidden_button').hide().prop('disabled', 'disabled');
        $('#articoolo_create_article_button').show().css('background-color', '#fc8b55').prop('disabled', '');
        return false;
    });


    $('#articoolo_article-write').on('keyup', function(e) {
        if (e.which == 13)
            return false;

        $('#suggesstions-error').text('');
        $('.article-optional-topics-var').find('a').css('color', '#858585');
        articooloShowSuggestionsButton();
    });

    $('#articoolo_create_hidden_button').click(function() {
        articooloGetSuggestions();
    });

    $('#articoolo_create_article_button').click(function() {
        $(this).css('background', '#E6ECEF').prop('disabled', 'disabled');
        articooloGetArticle();
    });

    $('#articoolo_rephrase_button').click(function() {
        $(this).css('background', '#E6ECEF').prop('disabled', 'disabled');
        articooloRephraseText();
    });

    $('#articoolo_show_more_button').click(function() {
        articooloGetArticleList(true);

    })

    $('.articoolo_articles_list_block').delegate('[name="article_item_view_link"]', 'click', function() {
        var split_id = $(this).parent().attr('id').split('_');
        articooloGetArticleById(split_id[2]);
    });

    $('#articoolo_article_list_link').click(function() {
        articoolo_empty_general_list = 0;
        if (articoolo_list_on_page) {
            $('#articoolo_article_view').hide();
            $('.articoolo_articles_list_block, .articoolo_articles_filter').show();
        }
        else {
            articoolo_next_page = 1;
            articooloHideMainContent();
            articooloGetArticleList();
            $('.articoolo_articles_container').children().remove();
        }
        return false;
    })

    $('#articoolo_filter_button').click(function() {
        articooloFilterArticles();
    });

    $('#articoolo_date_from').datepicker({
        showOn: "both",
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        buttonImage: articoolo_plugin_url + "/img/datepicker_icon.jpg",
        buttonImageOnly: true,
        dateFormat: 'dd.mm.yy',
        onClose: function( selectedDate ) {
            $( "#date_to" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    $('#articoolo_date_to').datepicker({
        showOn: "both",
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        buttonImage: articoolo_plugin_url + "/img/datepicker_icon.jpg",
        buttonImageOnly: true,
        dateFormat: 'dd.mm.yy',
        onClose: function( selectedDate ) {
            $( "#date_from" ).datepicker( "option", "maxDate", selectedDate );
        }
    });

    $('#articoolo_payment_button').click(function() {
        window.open(
            $('#articoolo_payment_link').val(),
            '_blank'
        );
    });

});

function articooloFilterArticles() {
    if (articoolo_empty_general_list) {
        $('.articoolo_articles_container').html('<div align="center">Please create at least one article</div>');
        return;
    }

    var filter_keyword = $('#articoolo_filter_keyword').val();
    var date_from = $('#articoolo_date_from').val();
    var date_to = $('#articoolo_date_to').val();

    if (!filter_keyword && !date_from && !date_to)
        return;

    var filter_values = {'filter_keyword' : filter_keyword, 'date_from': date_from, 'date_to': date_to};
    articooloGetArticleList(false, filter_values);

}

function articooloShowSuggestionsButton() {
    $('#articoolo_create_article_button').hide().prop('disabled', 'disabled');
    $('#articoolo_create_hidden_button').show().prop('disabled', '');
}

function articooloToggleLoader(mode, hide_suggestions) {
    if (mode == 'show') {
        $('#suggestions-block').hide();
        $('.suggestions-loader').show();
    }
    else {
        $('.suggestions-loader').hide();
        if (!hide_suggestions)
            $('#suggestions-block').show();
    }
}

function articooloGetArticleById(id) {
    articooloHideMainContent();

    $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {'action': 'articooloGetArticleById', 'article_id': id},
        dataType: "JSON",
        success: function (response) {
            $('#articoolo_uniqueness_amount').text(response['response']['uniqueness']);
            $('#articoolo_article_title_text').text(response['response']['normalize_keywords']);
            $('#articoolo_article_content').html(response['response']['article_text']);
            $('#articoolo_article_view').show();
        }
    });
}

function articooloGetArticle() {
    articooloHideMainContent();
    articooloToggleLoader('show');

    $('#articoolo_article-write,#articoolo_article-rephrase').prop('disabled', true);
    $('.article_generation_animation').show();
    var loader_int = setInterval(articlePreparingFadeAnimation, 1500);

    var article_length = $('#amount').val();
    var force_uniqueness = $('[name="force_uniqueness"]:checked').val();

    $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {'action': 'articooloGetArticle', 'input_keywords': $('#articoolo_article-write').val(), 'article_length': article_length, 'force_uniqueness': force_uniqueness},
        dataType: "JSON",
        success: function (response) {
            $('#articoolo_article-write,#articoolo_article-rephrase').prop('disabled', false);

            $('.article_generation_animation').hide();
            clearInterval(loader_int);
            articooloShowSuggestionsButton();
            articooloToggleLoader('hide', true);

            if (!response['response'] || response['response'] == 'null') {
                $('.article_generation_error').find('span').text('Can not create article for your topic. Please rephrase input keywords and try again.');
                $('.article_generation_error').show();
                return;
            }
            else if (response['response']['message']){
                var error_text = response['response']['message'];
                if (response['response']['message'] == 'no credits') {
                    error_text = 'Currently, you do not have credits on your balance. <br /> Please <a target="blank" href="'+ $('#articoolo_payment_link').val() + '"> buy credits</a> and you could create high-quality unique content!';
                }

                $('.article_generation_error').find('span').html(error_text + '.');
                $('.article_generation_error').show();
                return;
            }
            else {
                articoolo_list_on_page = 0;

                $('#articoolo_user_balance').text(response['response']['user_balance']);
                $('#articoolo_uniqueness_amount').text(response['response']['uniqueness']);
                $('#articoolo_article_title_text').text(response['response']['normalize_keywords']);
                $('#articoolo_article_content').html(response['response']['article_text']);
                $('#articoolo_article_view').show();
            }
        }
    });
}

function articooloRephraseText() {
    if (!$('#articoolo_article-rephrase').val())
        return;

    articooloHideMainContent();
    articooloToggleLoader('show');

    articooloToggleActiveElements('disabled');

    $('.article_generation_animation').show();
    var loader_int = setInterval(articlePreparingFadeAnimation, 1500);

    $('.article_generation_error').hide();

    $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {'action': 'articooloRephraseText', 'input_text': $('#articoolo_article-rephrase').val() },
        dataType: "JSON",
        success: function (response) {
            articoolo_list_on_page = 0;

            $('#articoolo_article-write,#articoolo_article-rephrase').prop('disabled', false);
            $('#articoolo_rephrase_button').show().css('background', '#FC8B55').prop('disabled', false);

            articooloToggleActiveElements('');

            $('.article_generation_animation').hide();
            clearInterval(loader_int);
            articooloToggleLoader('hide', true);

            if (!response['response'] || response['response'] == 'null') {
                $('.article_generation_error').find('span').text('Can not rephrase your text. Please rewrite input and try again.');
                $('.article_generation_error').show();
                return;
            }
            else if (response['response']['message']){
                var error_text = response['response']['message'];
                if (response['response']['message'] == 'no credits') {
                    error_text = 'Currently, you do not have credits on your balance. <br /> Please <a target="blank" href="'+ $('#articoolo_payment_link').val() + '"> buy credits</a> and you could create high-quality unique content!';
                }

                $('.article_generation_error').find('span').html(error_text);
                $('.article_generation_error').show();
                return;
            }
            else {
                articooloHideMainContent();
                $('#articoolo_user_balance').text(response['response']['user_balance']);
                $('#articoolo_uniqueness_amount').text(response['response']['uniqueness']);
                $('#articoolo_article_title_text').text(response['response']['normalize_keywords']);
                $('#articoolo_article_content').html(response['response']['article_text']);
                $('#articoolo_article_view').show();
            }
        }
    });
}

function articooloGetSuggestions() {
    if (!$('#articoolo_article-write').val())
        return;

    $('.article_generation_error').hide();
    articooloToggleLoader('show');

    $.ajax({
        type: "POST",
        url: ajaxurl,
        data: {'action': 'articooloGetSuggestions', 'input_keywords': $('#articoolo_article-write').val() },
        dataType: "JSON",
        success: function(response) {
            $(".article-optional-topics-var").html('');
            var suggestions_title;
            if (response['success'] == 1) {

                $('#articoolo_create_hidden_button').hide().prop('disabled', 'disabled');
                if (response['keyword_match'] != 1) {
                    $('#articoolo_create_article_button').show().css('background', '#E6ECEF').prop('disabled', true);
                }
                else {
                    $('#articoolo_create_article_button').show().css('background', '#FC8B55').prop('disabled', false);
                }

                if (response['suggestions_log_id'])
                    $('[name="suggestions_log_id"]').val(response['suggestions_log_id']);

                if (response['keyword_match']) {
                    suggestions_title = 'OPTIONAL TOPICS';
                     }
                else {
                    suggestions_title = 'CHOOSE AN ALTERNATIVE TOPIC';
                }

                $(".article-optional-topics-var").append(response['suggestions']);
                $('#suggestions_title_block').show();
            }
            else {
                suggestions_title = '';
                $(".article-optional-topics-var").append('<span id="suggesstions-error" style="color: red">' + response['error_message'] + '</span>');
            }

            $('#suggestions_title').text(suggestions_title);

            articooloToggleLoader('hide');
        }
    });
}

function articooloGetArticleList(show_more_click, filter_values) {
    if (!show_more_click)
        articooloHideMainContent();

    if (articoolo_empty_general_list)
        return;

    $('.articoolo_articles_filter').show();
    var data = {'action': 'articooloGetArticleList', 'page': articoolo_next_page };
    if (filter_values) {
        data = {'action': 'articooloGetArticleList', 'page': 1 };
        data =  $.extend(data, filter_values);
        $('.articoolo_articles_container').children().remove();
    }

    $('.articoolo_show_more_block').css('visibility', 'hidden');

    var current_article = new Array;

    $.ajax({
        type: "POST",
        url: ajaxurl,
        data: data,
        dataType: "JSON",
        success: function (response) {
            if (!response['response']['articles_data'] || !response['response']['articles_data']['articles'].length) {
                articoolo_empty_general_list = 1;

                if (filter_values) {
                    articoolo_empty_general_list = 0;
                    $('.articoolo_articles_container').html('<div align="center">No articles found</div>');
                }
            }
            else {
                for (var key in response['response']['articles_data']['articles']) {
                    current_article = response['response']['articles_data']['articles'][key];

                    var new_item = $('#article_list_item_prototype').clone();
                    new_item.appendTo('.articoolo_articles_container').attr('id', 'article_item_' + current_article['id']);

                    $('#article_item_' + current_article['id']).find('[name="article_item_title"]').text(current_article['normalize_keywords']);
                    $('#article_item_' + current_article['id']).find('[name="article_item_date"]').text(current_article['creation_date']);
                    $('#article_item_' + current_article['id']).find('[name="article_item_words_count"]').text(current_article['words_num'] + ' words');
                    $('#article_item_' + current_article['id']).show();

                }

                if (response['response']['articles_data']['show_more'])
                    $('.articoolo_show_more_block').css('visibility', 'visible');

                articoolo_next_page = response['response']['articles_data']['next_page'];
                $('.articoolo_articles_list_block').show();

                articoolo_list_on_page = 1;
            }
        }
    });
}

function articooloHideMainContent() {
    $('#articoolo_article_view,.articoolo_articles_list_block,.article_generation_error,.articoolo_articles_filter').hide();
}

function articlePreparingFadeAnimation() {
    $('.article_generation_animation span').fadeOut(1500, function() {
        $(this).fadeIn(1500);
    });
}

//Rephrase word count function
jQuery.fn.articooloWordCount = function(params){
    var p = {
        counterElement: 'display_count'
    };

    if(params) {
        jQuery.extend(p, params);
    }

    this.on("keyup paste cut focus change blur", function()
    {
        if (this.value=='' || this.value=='undefined'){
            var total_words = 0;
        } else {
            var total_words = this.value.match(/\S+/g).length;
        }
        jQuery('.'+p.counterElement).html(total_words);
        if (total_words > "500") {
            $('.article-write-word-count').hide();
            $('.article-write-word-warning').show();
            $('#articoolo_rephrase_button').prop('disabled', true);
            $('#articoolo_rephrase_button').show().css('background', '#E6ECEF').attr('disabled', true);


        } else {
            $('.article-write-word-warning').hide();
            $('.article-write-word-count').show();
            //$('#rephrase_hidden_button').prop('disabled', '');
            $('#articoolo_rephrase_button').show().css('background-color', '#fc8b55').prop('disabled', false);
        }
    });
};

function articooloToggleActiveElements(disabled_val) {
    $('#articoolo_article-write,#articoolo_article-rephrase,#articoolo_create_article_button,#articoolo_rephrase_button,#articoolo_create_hidden_button').prop('disabled', disabled_val);

    if (disabled_val == 'disabled') {
        $('#articoolo_rephrase_button,#articoolo_create_article_button').css('background', '#E6ECEF');
    }
    else {
        $('#articoolo_rephrase_button,#articoolo_create_article_button').css('background', '#FC8B55');
    }
}
