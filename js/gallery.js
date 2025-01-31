function canScroll(element) {
    let maxScroll = element.prop('scrollWidth') - element.outerWidth();
    let scrollLeft = element.scrollLeft();

    return {
        left: scrollLeft > 0,
        right: scrollLeft < maxScroll,
    };
}

function updatePrevNextVisiblity() {
    let scrollDirs = canScroll($('#gallery-scrollbar'));

    scrollDirs.left
        ? $('.gallery-prev').css('visibility', 'visible')
        : $('.gallery-prev').css('visibility', 'hidden');
    scrollDirs.right
        ? $('.gallery-next').css('visibility', 'visible')
        : $('.gallery-next').css('visibility', 'hidden');
}

function getOffset(container, element) {
    if (element) {
        let eleCenter = element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2;
        let containerCenter = container[0].getBoundingClientRect().left + container[0].getBoundingClientRect().width / 2;

        return eleCenter - containerCenter;
    }

    return undefined;
}

function getSnappedElement(container) {
    let deltas = [];
    const children = container.children();
    for (let i=0; i<children.length; i++) {
        let ele = children[i];
        let offset = getOffset(container, ele);

        let nextElement = children[i+1];
        let prevElement = children[i-1];

        deltas.push({
            element: ele,
            nextElement: nextElement,
            prevElement: prevElement,
            delta: Math.abs(offset),
            toNext: getOffset(container, nextElement),
            toPrev: getOffset(container, prevElement),
        });
    }

    deltas.sort(function(a, b) {
        return a.delta > b.delta;
    });

    return deltas[0];
}

$('.gallery-prev').click(function () {
    let container = $('#gallery-scrollbar');
    let snappedElement = getSnappedElement(container);
    let w = container[0].getAttribute('data-scroll-increment');

    if (w) {
        $('#gallery-scrollbar').animate({
            scrollLeft: '-=' + w
        }, 200, 'swing');
    } else if (snappedElement.toPrev) {
        $('#gallery-scrollbar').animate({
            scrollLeft: '+=' + snappedElement.toPrev
        }, 200, 'swing');
    }

});
$('.gallery-next').click(function () {
    let container = $('#gallery-scrollbar');
    let snappedElement = getSnappedElement(container);
    let w = container[0].getAttribute('data-scroll-increment');

    if (w) {
        $('#gallery-scrollbar').animate({
            scrollLeft: '+=' + w
        }, 200, 'swing');
    } else if (snappedElement.toNext) {
        $('#gallery-scrollbar').animate({
            scrollLeft: '+=' + snappedElement.toNext
        }, 200, 'swing');
    }

});

$('#gallery-scrollbar').on("scrollend", function (e) {
    updatePrevNextVisiblity();
});

$( document ).ready(function() {
    updatePrevNextVisiblity();

    // add popover
    $("a").each(function(i, e) {
        const pattern = /.*\/(#p[\d]+)/g;
        let href = e.getAttribute("href");
        let expr = pattern.exec(href);
        if (href && expr && expr[1]) {
            const id = expr[1];
            e.onmouseover = function(e) {
                const content = $(id).find('#content')
                if (content[0]) {
                    $("#gallery-popover").html(content[0].cloneNode(true))
                }
     
                $("#gallery-popover").css('left', e.clientX + 32);
                $("#gallery-popover").css('top', e.clientY);
                $("#gallery-popover").css('visibility', 'visible');
            }
            e.onmouseout = function(e) {
                $("#gallery-popover").css('visibility', 'hidden');
            }
        }
    });
});

