package brightspot.article;

import java.util.List;

import brightspot.author.Author;
import brightspot.section.Section;
import com.psddev.cms.db.BoardSearchResultField;
import com.psddev.dari.db.Alteration;

public class ListicleAlteration extends Alteration<Listicle> {

    @BoardSearchResultField
    @InternalName("hasAuthors.getAuthors")
    private List<Author> getAuthors;

    @BoardSearchResultField
    @InternalName("hasSection.getSectionParent")
    private Section getSectionParent;
}
