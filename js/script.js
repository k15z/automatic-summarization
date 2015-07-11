/**
 * automatic-summarization
 * @license The MIT License
 * @copyright 2015 Kevin Zhang
 * @link http://www.kevz.me
 */
$(document).ready(function() {
   // Summarize Button
   $('#summarize').click(function() {
      var original = $('#original').val();
      if (original.length == 0) {
         $('#textrank').val('');
         $('#compactr').val('');
      }
      else {
         $('#textrank').val(textrank(original));
         $('#compactr').val(compactr(original));
      }
   });

   // TextRank Algorithm
   function textrank(original, N) {
      if (N == null)
         N = 2; // default # sentences

      // Extract Sentences
      var sentences = original.match(/\S.*?\S{3,}[\n\.\!\?]"?(?=(\s|$)+([A-Z]|\d|\s|$))/g);
      if (!sentences || sentences.length <= N)
         return "> The original text doesn't have enough sentences.";
      var similarity = new Array(sentences.length);

      // Compute Similarities
      function compare(s1, s2) {
         s1 = s1.split(/\s/g);
         s2 = s2.split(/\s/g);

         var count = 0;
         var dictionary = {};
         s1.forEach(function(word) {
            dictionary[word] = true;
         });
         s2.forEach(function(word) {
            if (dictionary[word] == true)
               count++;
         });

         return (2 * count) / (s1.length + s2.length);
      }
      for (var s1 = 0; s1 < sentences.length; s1++) {
         similarity[s1] = 0.0;
         sentences[s1] = sentences[s1].trim();
         for (var s2 = 0; s2 < sentences.length; s2++)
            similarity[s1] += compare(sentences[s1], sentences[s2]);
      }

      // Extract N Best Choices
      var indices = new Array(sentences.length);
      for (var i = 0; i < sentences.length; i++)
         indices[i] = i;
      indices.sort(function(a, b) { return similarity[b] - similarity[a]; });
      indices = indices.splice(0, N).sort();
      var result = "";
      for (var n = 0; n < indices.length; n++)
         result += sentences[indices[n]] + " ";
      return result;
   }

   // CompactR Algorithm
   function compactr(original, N) {
      if (N == null)
         N = 2; // default # sentences

      // Extract Sentences
      var sentences = original.match(/\S.*?\S{3,}[\n\.\!\?]"?(?=(\s|$)+([A-Z]|\d|\s|$))/g);
      if (!sentences || sentences.length <= N)
         return "> The original text doesn't have enough sentences.";
      var similarity = new Array(sentences.length);

      // Compute Similarities
      function compare(s1, s2) {
         s1 = s1.split(/\s/g);
         s2 = s2.split(/\s/g);

         var dictionary = {};
         s1.forEach(function(word) {
            dictionary[word] = 0;
         });
         s2.forEach(function(word) {
            if (dictionary[word] >= 0)
               dictionary[word]++;
         });

         var count = 0;
         s1.forEach(function(word) {
            count += dictionary[word];
         });

         return count;
      }
      for (var s1 = 0; s1 < sentences.length; s1++) {
         similarity[s1] = 0.0;
         sentences[s1] = sentences[s1].trim();
         for (var s2 = 0; s2 < sentences.length; s2++)
            similarity[s1] += compare(sentences[s1], sentences[s2]);
      }

      // Extract N Best Choices
      var indices = new Array(sentences.length);
      for (var i = 0; i < sentences.length; i++)
         indices[i] = i;
      indices.sort(function(a, b) { return similarity[b] - similarity[a]; });
      indices = indices.splice(0, N).sort();
      var result = "";
      for (var n = 0; n < indices.length; n++)
         result += sentences[indices[n]] + " ";
      return result;
   }
});
